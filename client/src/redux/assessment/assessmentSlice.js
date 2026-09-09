import { createSlice } from "@reduxjs/toolkit";
import {
  createAssessmentThunk,
  getAssessmentThunk,
  getLatestCompletedAssessmentThunk,
  submitAssessmentThunk,
} from "./assessmentThunk";

const initialState = {
  assessment: null,
  assessmentResult: null,
  latestCompletedAssessment: null,
  loading: false,
  error: null,
};

const assessmentSlice = createSlice({
  name: "assessment",

  initialState,

  reducers: {
    clearAssessment: (state) => {
      state.assessment = null;
      state.error = null;
    },
    clearAssessmentResult: (state) => {
      state.assessmentResult = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Create Assessment
      .addCase(createAssessmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createAssessmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.assessment = action.payload;
      })

      .addCase(createAssessmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getAssessmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAssessmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.assessment = action.payload;
      })

      .addCase(getAssessmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(submitAssessmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(submitAssessmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.assessmentResult = action.payload.data;
      })

      .addCase(submitAssessmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLatestCompletedAssessmentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getLatestCompletedAssessmentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.latestCompletedAssessment = action.payload;
      })

      .addCase(getLatestCompletedAssessmentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssessment, clearAssessmentResult } =
  assessmentSlice.actions;

export default assessmentSlice.reducer;
