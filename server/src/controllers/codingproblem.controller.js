import mongoose from "mongoose";
import { PreparationSession } from "../models/index.model.js";
import { AppError } from "../middleware/AppError.js";
import { generateCodingProblemsWithAI } from "../utils/generateCodingProblems.js";

export const generateCodingProblems = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    if (!mongoose.isValidObjectId(sessionId)) {
      return next(new AppError("Invalid session id", 400));
    }

    const session = await PreparationSession.findById(sessionId);

    if (!session) {
      return next(new AppError("Preparation session not found", 404));
    }
     
    // console.log("sessionId:", sessionId);
    // Return existing recommendations instead of calling Gemini again
    if (session.codingProblemRecommendations?.length > 0) {
      return res.status(200).json({
        success: true,
        data: session.codingProblemRecommendations,
      });
    }

    const result = await generateCodingProblemsWithAI(
      session.companyName,
      session.roleName,
      session.jobDescriptionText,
    );

    session.codingProblemRecommendations = result.recommendations;

    await session.save();

    return res.status(200).json({
      success: true,
      data: session.codingProblemRecommendations,
    });
  } catch (error) {
    console.log("Error generating coding problems:", error);
    next(error);
  }
};