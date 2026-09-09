import { createSlice } from "@reduxjs/toolkit";
import {
  applyPendingRevisionThunk,
  generateRoadmapThunk,
  getPendingRevisionThunk,
  getRoadmapThunk,
  rejectPendingRevisionThunk,
  updateRoadmapItemCompletionThunk,
} from "./roadmapThunk";

const initialState = {
  roadmap: null,
  pendingRevision: null,
  loading: false,
  error: null,
  // isRoadmapGenerated: false,
};

const roadmapSlice = createSlice({
  name: "roadmap",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(generateRoadmapThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(generateRoadmapThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmap = action.payload;
        // state.isRoadmapGenerated = true;
      })

      .addCase(generateRoadmapThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getRoadmapThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getRoadmapThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmap = action.payload;
      })

      .addCase(getRoadmapThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Roadmap Item Completion
      .addCase(updateRoadmapItemCompletionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoadmapItemCompletionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.roadmap = action.payload;
      })
      .addCase(updateRoadmapItemCompletionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPendingRevisionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPendingRevisionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingRevision = action.payload;
      })

      .addCase(getPendingRevisionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(applyPendingRevisionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(applyPendingRevisionThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.roadmap = action.payload;

        state.pendingRevision = null;
      })

      .addCase(applyPendingRevisionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(rejectPendingRevisionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(rejectPendingRevisionThunk.fulfilled, (state) => {
        state.loading = false;
        state.pendingRevision = null;
      })

      .addCase(rejectPendingRevisionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default roadmapSlice.reducer;
