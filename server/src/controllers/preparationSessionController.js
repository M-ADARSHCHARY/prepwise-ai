import mongoose from "mongoose";
import PreparationSession from "../models/preparationSession.model.js";
import Roadmap from "../models/roadmap.model.js";
import { AppError } from "../middleware/AppError.js";
import { cleanExtractedText } from "../utils/textCleaner.js";
import {
  deleteTemporaryFile,
  extractTextFromFile,
} from "../utils/extractTextFromFile.js";
import { analyzeSessionWithAI } from "../utils/analyzeSession.js";
import { generateRoadmapWithAI } from "../utils/generateRoadMap.js";
import { Assessment } from "../models/index.model.js";

export async function createPreparationSession(req, res, next) {
  const resumeFilePath = req.files?.resume?.[0]?.path;
  const jobDescriptionFilePath = req.files?.jobDescription?.[0]?.path;

  try {
    const { user, companyName, roleName, timeAvailableDays } = req.body;
    const resumeFile = req.files?.resume?.[0];
    const jobDescriptionFile = req.files?.jobDescription?.[0];

    const missingFields = [];

    if (!user) missingFields.push("user");
    if (!companyName) missingFields.push("companyName");
    if (!roleName) missingFields.push("roleName");
    if (!timeAvailableDays) missingFields.push("timeAvailableDays");
    if (!resumeFile) missingFields.push("resume");
    if (!jobDescriptionFile) missingFields.push("jobDescription");

    if (missingFields.length > 0) {
      return next(
        new AppError(
          `Missing required preparation session fields: ${missingFields.join(", ")}`,
          400,
        ),
      );
    }

    if (!mongoose.isValidObjectId(user)) {
      return next(
        new AppError(
          "user must be a valid MongoDB ObjectId from the created User record",
          400,
        ),
      );
    }

    const [resumeRawText, jobDescriptionRawText] = await Promise.all([
      extractTextFromFile(resumeFilePath),
      extractTextFromFile(jobDescriptionFilePath),
    ]);

    const cleanedResumeText = cleanExtractedText(resumeRawText);
    const cleanedJobDescriptionText = cleanExtractedText(jobDescriptionRawText);

    if (!cleanedResumeText || !cleanedJobDescriptionText) {
      return next(
        new AppError("Could not extract valid text from uploaded files", 400),
      );
    }

    const session = await PreparationSession.create({
      user,
      companyName,
      roleName,
      timeAvailableDays,
      resumeFileName: resumeFile.originalname,
      jobDescriptionFileName: jobDescriptionFile.originalname,
      resumeText: cleanedResumeText,
      jobDescriptionText: cleanedJobDescriptionText,
      analysisStatus: "pending",
    });

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (error) {
    next(error);
  } finally {
    await Promise.all([
      resumeFilePath ? deleteTemporaryFile(resumeFilePath) : Promise.resolve(),
      jobDescriptionFilePath
        ? deleteTemporaryFile(jobDescriptionFilePath)
        : Promise.resolve(),
    ]);
  }
}

export async function getUserPreparationSessions(req, res, next) {
  try {
    const sessions = await PreparationSession.find({ user: req.user._id }).sort(
      { createdAt: -1 },
    );

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoadmapBySessionId(req, res, next) {
  try {
    const session = await PreparationSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return next(new AppError("Preparation session not found", 404));
    }

    const roadmap = await Roadmap.findOne({ session: session._id });

    if (!roadmap) {
      return next(new AppError("Roadmap not found", 404));
    }

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPreparationSessionById(req, res, next) {
  try {
    const session = await PreparationSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return next(new AppError("Preparation session not found", 404));
    }

    const roadmap = await Roadmap.findOne({ session: session._id });

    let roadmapExists = false;
    if (roadmap) {
      roadmapExists = true;
    }

    res.status(200).json({
      success: true,
      data: {
        ...session.toObject(),
        roadmapExists,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzePreparationSession(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError("Invalid session id", 400));
    }

    const session = await PreparationSession.findById(id);

    if (!session) {
      return next(new AppError("Preparation session not found", 404));
    }

    const analysisResult = await analyzeSessionWithAI(
      session.resumeText,
      session.jobDescriptionText,
    );

    session.atsScore = analysisResult.atsScore;
    session.matchedSkills = analysisResult.matchedSkills;
    session.missingSkills = analysisResult.missingSkills;
    session.resumeImprovements = analysisResult.resumeImprovements;
    session.aiSummary = analysisResult.aiSummary;
    session.analysisStatus = "completed";

    await session.save();

    const roadmap = await Roadmap.findOne({ session: session._id });

    let roadmapExists = false;
    if (roadmap) {
      roadmapExists = true;
    }

    res.status(200).json({
      success: true,
      data: {
        ...session.toObject(),
        roadmapExists,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function generateSessionRoadmap(req, res, next) {
  try {
    const { id } = req.params;
    console.log("Generating roadmap for session:", id);

    if (!mongoose.isValidObjectId(id)) {
      return next(new AppError("Invalid session id", 400));
    }

    const session = await PreparationSession.findById(id);
    // console.log("Session found:", session); // Debugging line
    if (!session) {
      return next(new AppError("Preparation session not found", 404));
    }

    if (!session.atsScore) {
      return next(new AppError("Analyze session first", 400));
    }

    // Call AI

    const roadmapData = await generateRoadmapWithAI(session);

    const quizCategories = new Set([
      "coding_practice",
      "cs_fundamentals",
      "missing_skill",
    ]);

    roadmapData.items = roadmapData.items.map((item) => ({
      ...item,
      hasQuiz: quizCategories.has(item.category),
    }));

    let roadmap = await Roadmap.findOne({ session: id });

    if (roadmap) {
      roadmap.totalDays = roadmapData.totalDays;
      roadmap.focusAreas = roadmapData.focusAreas;
      roadmap.items = roadmapData.items;
      roadmap.lastAdaptedAt = new Date();
      roadmap.pendingRevision = null;

      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        session: id,
        ...roadmapData,
      });
    }

    res.status(201).json({
      success: true,
      data: roadmap,
    });
  } catch (err) {
    next(err);
  }
}



export async function updateRoadmapItemCompletion(req, res, next) {
  try {
    const { itemId } = req.params;

    const { completed } = req.body;

    let roadmap = await Roadmap.findOne({ "items._id": itemId });

    if (!roadmap) {
      return next(new AppError("Roadmap item not found", 404));
    }
    const item = roadmap.items.find((item) => item._id.toString() === itemId);

    item.completed = completed;
    await roadmap.save();

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePreparationSessionById(req, res, next) {
  try {
    const { sessionId } = req.params;

    // console.log("Deleting preparation session with ID:", sessionId);
    if (!mongoose.isValidObjectId(sessionId)) {
      return next(new AppError("Invalid session id", 400));
    }

    const session = await PreparationSession.findById(sessionId);

    if (!session) {
      return next(new AppError("Preparation session not found", 404));
    }

    // Delete all assessments belonging to this session
    await Assessment.deleteMany({
      session: sessionId,
    });

    // Delete all roadmaps belonging to this session
    await Roadmap.deleteMany({
      session: sessionId,
    });

    // Finally delete the preparation session
    await PreparationSession.findByIdAndDelete(sessionId);

    return res.status(200).json({
      success: true,
      message: "Preparation session deleted successfully",
      data: {
        sessionId,
      },
    });
  } catch (error) {
    console.log("Error deleting preparation session:", error);
    next(error);
  }
}
