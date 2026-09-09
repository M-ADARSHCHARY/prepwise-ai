import mongoose from "mongoose";
import Assessment from "../models/assessment.model.js";
import { PreparationSession, Roadmap } from "../models/index.model.js";
import { generateAssessmentWithAI } from "../utils/generateAssessment.js";
import { AppError } from "../middleware/AppError.js";
import { generateRoadmapWithAI } from "../utils/generateRoadMap.js";

const ADAPTATION_THRESHOLD = 60;

export const createAssessment = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    console.log("Creating assessment for roadmap item:", itemId);

    if (!mongoose.isValidObjectId(itemId)) {
      return next(new AppError("Invalid roadmap item id", 400));
    }

    const roadmap = await Roadmap.findOne({ "items._id": itemId });

    if (!roadmap) {
      return next(new AppError("Roadmap item not found", 404));
    }

    const roadmapItem = roadmap.items.find(
      (item) => item._id.toString() === itemId,
    );
    if (!roadmapItem) {
      return next(new AppError("Roadmap item not found", 404));
    }

    if (!roadmapItem.hasQuiz) {
      return next(
        new AppError("Quiz is not available for this roadmap item.", 400),
      );
    }

    const existingAssessment = await Assessment.findOne({
      roadmapItemId: roadmapItem._id,
      status: "pending",
    });

    if (existingAssessment) {
      return res.status(200).json({
        success: true,
        data: existingAssessment,
      });
    }

    const assessmentData = await generateAssessmentWithAI(
      roadmapItem.title,
      roadmapItem.topics,
    );

    const assessment = await Assessment.create({
      session: roadmap.session,

      roadmap: roadmap._id,

      roadmapItemId: roadmapItem._id,

      title: roadmapItem.title,

      questions: assessmentData.questions,

      totalQuestions: assessmentData.questions.length,

      attemptNumber: 1,

      status: "pending",
    });

    // console.log("Assessment created:", assessment);

    return res.status(201).json({
      success: true,
      data: assessment,
    });
  } catch (err) {
    console.log("Error creating assessment:", err);
    next(err);
  }
};

export const getAssessmentById = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;

    if (!mongoose.isValidObjectId(assessmentId)) {
      return next(new AppError("Invalid assessment id", 400));
    }

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return next(new AppError("Assessment not found", 404));
    }

    return res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (err) {
    next(err);
  }
};

export const submitAssessment = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const { answers } = req.body;

    if (!mongoose.isValidObjectId(assessmentId)) {
      return next(new AppError("Invalid assessment id", 400));
    }

    if (!Array.isArray(answers)) {
      return next(new AppError("Answers must be an array", 400));
    }

    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return next(new AppError("Assessment not found", 404));
    }

    if (assessment.status === "completed") {
      return next(new AppError("Assessment already submitted", 400));
    }

    let correctAnswers = 0;
    const topicStats = {};

    // Calculate score and topic-wise performance
    assessment.questions.forEach((question) => {
      const submittedAnswer = answers.find(
        (answer) => answer.questionId.toString() === question._id.toString(),
      );

      if (!submittedAnswer) {
        return;
      }

      question.userAnswer = submittedAnswer.userAnswer;

      const topic = question.topic;

      if (!topicStats[topic]) {
        topicStats[topic] = {
          correct: 0,
          total: 0,
        };
      }

      topicStats[topic].total++;

      if (submittedAnswer.userAnswer === question.correctAnswer) {
        correctAnswers++;
        topicStats[topic].correct++;
      }
    });

    // Calculate weak areas
    const weakAreas = Object.entries(topicStats)
      .map(([topic, stats]) => {
        const accuracy = Math.round((stats.correct / stats.total) * 100);

        return {
          topic,
          correct: stats.correct,
          total: stats.total,
          accuracy,
        };
      })
      .filter((area) => area.accuracy < 60);

    assessment.weakAreas = weakAreas;

    // Calculate overall score
    const score = Math.round(
      (correctAnswers / assessment.totalQuestions) * 100,
    );

    assessment.score = score;
    assessment.status = "completed";

    await assessment.save();

    /*
     * ADAPTIVE ROADMAP
     *
     * If the score is below the threshold:
     *
     * 1. Find the roadmap item where the test was taken.
     * 2. Preserve everything before that item.
     * 3. Send the entire roadmap + weak areas + starting item to Gemini.
     * 4. Store Gemini's generated roadmap as a pending revision.
     *
     * The actual roadmap is NOT changed until the user
     * clicks "Apply This Roadmap".
     */
    if (score < ADAPTATION_THRESHOLD) {
      const session = await PreparationSession.findById(assessment.session);

      if (!session) {
        return next(new AppError("Preparation session not found", 404));
      }

      const roadmap = await Roadmap.findById(assessment.roadmap);

      if (!roadmap) {
        return next(new AppError("Roadmap not found", 404));
      }

      // Find the exact item where the assessment was taken
      const startIndex = roadmap.items.findIndex(
        (item) => item._id.toString() === assessment.roadmapItemId.toString(),
      );

      if (startIndex === -1) {
        return next(new AppError("Assessment roadmap item not found", 404));
      }

      const startItem = roadmap.items[startIndex];

      console.log(`Generating adaptive roadmap from item: ${startItem.title}`);

      // Generate only the adaptive portion conceptually,
      // while giving Gemini the complete roadmap for context.
      const adaptiveRoadmap = await generateRoadmapWithAI(session, {
        mode: "adaptive",

        weakAreas: assessment.weakAreas,

        previousRoadmap: roadmap.items,

        startItem: {
          title: startItem.title,
          description: startItem.description,
          category: startItem.category,
          topics: startItem.topics,
          dayNumber: startItem.dayNumber,
        },
      });

      // Add quiz availability to newly generated items
      const quizCategories = new Set([
        "coding_practice",
        "cs_fundamentals",
        "missing_skill",
      ]);

      adaptiveRoadmap.items = adaptiveRoadmap.items.map((item) => ({
        ...item,
        hasQuiz: quizCategories.has(item.category),
      }));

      /*
       * Store the revision instead of immediately modifying
       * roadmap.items.
       *
       * fromItemIndex tells applyPendingRevision where the
       * replacement should begin.
       */
      roadmap.pendingRevision = {
        generatedFromAssessmentId: assessment._id,
        triggerScore: score,

        fromItemIndex: startIndex,
        fromItemId: startItem._id,

        reason: `Assessment score ${score}% is below the adaptation threshold.`,

        generatedAt: new Date(),

        data: adaptiveRoadmap,
      };

      await roadmap.save();

      console.log("Adaptive roadmap stored as pending revision.");
    }

    /*
     * Mark the assessment's roadmap item as completed.
     *
     * This happens on the ORIGINAL roadmap item, so its
     * _id, quizCompleted and quizScore remain intact.
     */
    const roadmap = await Roadmap.findById(assessment.roadmap);

    if (roadmap) {
      const roadmapItem = roadmap.items.find(
        (item) => item._id.toString() === assessment.roadmapItemId.toString(),
      );

      if (roadmapItem) {
        roadmapItem.quizCompleted = true;
        roadmapItem.quizScore = score;

        await roadmap.save();
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        assessmentId: assessment._id,
        score,
        correctAnswers,
        totalQuestions: assessment.totalQuestions,
        status: assessment.status,
      },
    });
  } catch (error) {
    console.log("Error submitting assessment:", error);
    next(error);
  }
};

export const getLatestCompletedAssessment = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    if (!mongoose.isValidObjectId(itemId)) {
      return next(new AppError("Invalid roadmap item id", 400));
    }

    const assessment = await Assessment.findOne({
      roadmapItemId: itemId,
      status: "completed",
    }).sort({ createdAt: -1 });

    if (!assessment) {
      return next(
        new AppError(
          "No completed assessment found for this roadmap item",
          404,
        ),
      );
    }

    return res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};
