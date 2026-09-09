import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";


export const createAssessmentThunk = createAsyncThunk(
  "assessment/createAssessment",
  async (itemId, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `/assessments/item/${itemId}/assessment`
      );

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: "Unable to create assessment.",
        }
      );
    }
  }
);

export const getAssessmentThunk = createAsyncThunk(
  "assessment/getAssessment",
  async (assessmentId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/assessments/${assessmentId}`
      );

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: "Unable to fetch assessment.",
        }
      );
    }
  }
);


export const submitAssessmentThunk = createAsyncThunk(
  "assessment/submitAssessment",
  async ({ assessmentId, answers }, thunkAPI) => {
    try {
      const res = await axiosInstance.post(
        `/assessments/${assessmentId}/submit`,
        { answers }
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: "Unable to submit assessment.",
        }
      );
    }
  }
);



export const getLatestCompletedAssessmentThunk = createAsyncThunk(
  "assessment/getLatestCompletedAssessment",
  async (itemId, thunkAPI) => {
    try {
      const res = await axiosInstance.get(
        `/assessments/item/${itemId}/result`
      );

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || {
          message: "Unable to fetch assessment result.",
        }
      );
    }
  }
);