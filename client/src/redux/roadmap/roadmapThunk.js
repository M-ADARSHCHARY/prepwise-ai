import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

export const generateRoadmapThunk = createAsyncThunk(
    "roadmap/generate",
    async (sessionId, thunkAPI) => {
        try {
            console.log("Generating roadmap for session:", sessionId);
            const res = await axiosInstance.post(
                `/preparation-sessions/${sessionId}/generate-roadmap`
            );

            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || {
                    message: "Unable to generate roadmap.",
                }
            );
        }
    }
);

export const getRoadmapThunk = createAsyncThunk(
    "roadmap/get",
    async (sessionId, thunkAPI) => {
        try {
            console.log("Fetching roadmap for session:", sessionId);
            const res = await axiosInstance.get(
                `/preparation-sessions/${sessionId}/roadmap`
            );

            return res.data.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.response?.data || {
                    message: "Unable to fetch roadmap.",
                }
            );
        }
    }
);

export const updateRoadmapItemCompletionThunk = createAsyncThunk(
    "roadmap/updateItemCompletion",
    async ({ itemId, completed }, thunkAPI) => {    
    try {
        const res = await axiosInstance.patch(
            `/preparation-sessions/roadmap/item/${itemId}`,
            { completed }
        );  
        return res.data.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(
            err.response?.data || {
                message: "Unable to update roadmap item completion.",
            }
        );
    }
} );


export const getPendingRevisionThunk = createAsyncThunk(
  "roadmap/getPendingRevision",
  async (roadmapId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/roadmaps/${roadmapId}/pending-revision`
      );
      
      console.log("Fetched pending revision:", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch pending revision"
      );
    }
  }
);


export const applyPendingRevisionThunk = createAsyncThunk(
  "roadmap/applyPendingRevision",
  async (roadmapId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(
        `/roadmaps/${roadmapId}/apply-revision`
      );

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to apply roadmap revision"
      );
    }
  }
);


export const rejectPendingRevisionThunk = createAsyncThunk(
  "roadmap/rejectPendingRevision",
  async (roadmapId, { rejectWithValue }) => {
    try {
        console.log("Rejecting pending revision for roadmap:", roadmapId);
      const response = await axiosInstance.delete(
        `/roadmaps/${roadmapId}/reject-revision`,
      );

      console.log("Rejected pending revision:", response.data);

      return response.data;
    } catch (error) {
        console.log(error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to reject roadmap revision",
      );
    }
  },
);