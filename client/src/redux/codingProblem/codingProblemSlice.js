import { createSlice } from "@reduxjs/toolkit";
import { generateCodingProblemsThunk } from "./codingProblemThunk";

const initialState = {
  recommendations: [],
  loading: false,
  error: null,
};

const codingProblemSlice = createSlice({
  name: "codingProblem",

  initialState,

  reducers: {
    clearCodingProblems: (state) => {
      state.recommendations = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(generateCodingProblemsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(
        generateCodingProblemsThunk.fulfilled,
        (state, action) => {
          state.loading = false;
          state.recommendations = action.payload;
        },
      )

      .addCase(
        generateCodingProblemsThunk.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearCodingProblems } = codingProblemSlice.actions;

export default codingProblemSlice.reducer;