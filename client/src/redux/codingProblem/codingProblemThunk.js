import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from '../../services/axiosInstance'
export const generateCodingProblemsThunk = createAsyncThunk(
  "codingProblem/generate",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/coding-problems/${sessionId}/generate`,
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to generate coding problems",
      );
    }
  },
);