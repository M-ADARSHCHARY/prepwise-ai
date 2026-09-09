import axios from "axios";
import { AppError } from "../middleware/AppError.js";

function getFastApiBaseUrl() {
  const rawBaseUrl = process.env.FASTAPI_URL || "http://localhost:8000";

  return rawBaseUrl.replace(/\/?api\/?$/, "");
}

export async function analyzeSessionWithAI(resumeText, jobDescriptionText) {
  try {
    const response = await axios.post(
      `${getFastApiBaseUrl()}/api/analyze`,
      {
        resume_text: resumeText,
        job_description_text: jobDescriptionText,
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new AppError(
        error.response.data?.detail || "Failed to analyze session",
        error.response.status
      );
    }

    throw new AppError("Unable to connect to AI Analysis Service", 500);
  }
}
