import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

/* ---------------- CREATE SESSION ---------------- */

export const createSessionThunk = createAsyncThunk(
    "session/create",
    async (formData, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                "/preparation-sessions",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Unable to create preparation session.",
                status: error.response?.status || 500,
            });
        }
    }
);

/* ---------------- GET ALL SESSIONS ---------------- */

export const getSessionsThunk = createAsyncThunk(
    "session/getAll",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                "/preparation-sessions/user-sessions"
            );

            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Unable to fetch sessions.",
                status: error.response?.status || 500,
            });
        }
    }
);

/* ---------------- GET SINGLE SESSION ---------------- */

export const getSessionByIdThunk = createAsyncThunk(
    "session/getById",
    async (sessionId, thunkAPI) => {
        try {
            const res = await axiosInstance.get(
                `/preparation-sessions/${sessionId}`
            );

            console.log("session",res.data.data);

            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Unable to fetch session.",
                status: error.response?.status || 500,
            });
        }
    }
);

/* ---------------- ANALYZE SESSION ---------------- */

export const analyzeSessionThunk = createAsyncThunk(
    "session/analyze",
    async (sessionId, thunkAPI) => {
        try {
            const res = await axiosInstance.post(
                `/preparation-sessions/${sessionId}/analyze`
            );

            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                message:
                    error.response?.data?.message ||
                    "Unable to analyze session.",
                status: error.response?.status || 500,
            });
        }
    }
);

export const deleteSessionThunk = createAsyncThunk(
  "session/deleteSession",
  async (sessionId, { rejectWithValue }) => {
    try {
        console.log("Deleting session with ID:", sessionId); // Debugging log
      const response = await axiosInstance.delete(
        `/preparation-sessions/${sessionId}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete preparation session",
      );
    }
  },
);