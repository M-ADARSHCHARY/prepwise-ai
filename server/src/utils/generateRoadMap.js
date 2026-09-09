import axios from "axios";
import { AppError } from "../middleware/AppError.js";

function getFastApiBaseUrl() {
  const rawBaseUrl =
    process.env.FASTAPI_URL || "http://localhost:8000";

  return rawBaseUrl.replace(/\/?api\/?$/, "");
}

export async function generateRoadmapWithAI(session, options = {}) {
  try {
    const payload = {
      company: session.companyName,
      role: session.roleName,
      timeAvailableDays: session.timeAvailableDays,

      resumeText: session.resumeText,
      jobDescriptionText: session.jobDescriptionText,

      atsScore: session.atsScore,

      matchedSkills: session.matchedSkills,

      missingSkills: session.missingSkills.map(
        (item) => item.skill,
      ),

      resumeImprovements: session.resumeImprovements.map(
        (item) => item.suggestion,
      ),

      aiSummary: session.aiSummary,

      // Standard or adaptive
      mode: options.mode || "standard",

      // Used during adaptive generation
      weakAreas: options.weakAreas || [],

      // Complete existing roadmap for Gemini context
      previousRoadmap: options.previousRoadmap || [],

      // Exact roadmap item where adaptation should start
      startItem: options.startItem || null,
    };

    const response = await axios.post(
      `${getFastApiBaseUrl()}/api/roadmap/generate`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.log("FastAPI status:", error.response.status);

      console.log(
        "FastAPI response:",
        JSON.stringify(error.response.data, null, 2),
      );

      throw new AppError(
        typeof error.response.data?.detail === "string"
          ? error.response.data.detail
          : "FastAPI validation error",
        error.response.status,
      );
    }

    throw new AppError(
      "Unable to connect to AI Roadmap Service",
      500,
    );
  }
}