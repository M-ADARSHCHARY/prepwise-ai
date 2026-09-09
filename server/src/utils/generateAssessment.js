import axios from "axios";
import { AppError } from "../middleware/AppError.js";

function getFastApiBaseUrl() {
  const rawBaseUrl = process.env.FASTAPI_URL || "http://localhost:8000";

  return rawBaseUrl.replace(/\/?api\/?$/, "");
}

export async function generateAssessmentWithAI(title, topics) {
  try {
    const payload = {
      title,
      topics,
    };

    const response = await axios.post(
      `${getFastApiBaseUrl()}/api/assessment/generate`,
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
      throw new AppError(
        error.response.data?.detail || "Failed to generate assessment",
        error.response.status,
      );
    }

    throw new AppError("Unable to connect to AI Assessment Service", 500);
  }
}