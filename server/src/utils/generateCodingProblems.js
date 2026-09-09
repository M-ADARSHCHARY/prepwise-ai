import axios from "axios";
import { AppError } from "../middleware/AppError.js";

function getFastApiBaseUrl() {
  const rawBaseUrl =
    process.env.FASTAPI_URL || "http://localhost:8000";

  return rawBaseUrl.replace(/\/?api\/?$/, "");
}

export async function generateCodingProblemsWithAI(
  company,
  role,
  jobDescriptionText,
) {
  try {
    const payload = {
      company,
      role,
      jobDescriptionText,
    };

    const response = await axios.post(
      `${getFastApiBaseUrl()}/api/coding-problems/generate`,
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
        error.response.data?.detail ||
          "Failed to generate coding problem recommendations",
        error.response.status,
      );
    }

    throw new AppError(
      "Unable to connect to AI Coding Problem Service",
      500,
    );
  }
}