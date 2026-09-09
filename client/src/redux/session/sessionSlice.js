import { createSlice } from "@reduxjs/toolkit";
import {
    createSessionThunk,
    getSessionsThunk,
    getSessionByIdThunk,
    analyzeSessionThunk,
    deleteSessionThunk,
} from "./sessionThunk";

const initialState = {
    loading: false,
    session: null,
    sessionId: localStorage.getItem("prepwise_active_session_id"),
    sessions: [],
    error: null,
    isSessionDeleting: false,
};

const sessionSlice = createSlice({
    name: "session",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder

            // CREATE SESSION
            .addCase(createSessionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload;
                state.sessionId = action.payload._id;
                state.error = null;

                localStorage.setItem(
                    "prepwise_active_session_id",
                    action.payload._id
                );

                // Update dashboard immediately
                state.sessions.unshift(action.payload);
            })

            .addCase(createSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET ALL SESSIONS
            .addCase(getSessionsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSessionsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.sessions = action.payload;
                state.error = null;
            })

            .addCase(getSessionsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET SESSION BY ID
            .addCase(getSessionByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSessionByIdThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload;
                console.log("Session data received:", action.payload);
                state.sessionId = action.payload._id;
                state.error = null;

                localStorage.setItem(
                    "prepwise_active_session_id",
                    action.payload._id
                );
            })

            .addCase(getSessionByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ANALYZE SESSION
            .addCase(analyzeSessionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(analyzeSessionThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload;
                state.error = null;

                // Update dashboard list as well
                state.sessions = state.sessions.map((session) =>
                    session._id === action.payload._id
                        ? action.payload
                        : session
                );
            })

            .addCase(analyzeSessionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteSessionThunk.pending, (state, action) => {
                state.isSessionDeleting = true;
                state.error = action.payload;
            })
            .addCase(deleteSessionThunk.fulfilled, (state, action) => {
                state.isSessionDeleting = false;
                const sessionId = action.payload.data.sessionId;
                state.sessions = state.sessions.filter((session) => session._id !== sessionId);
            })
            .addCase(deleteSessionThunk.rejected, (state, action) => {
                state.isSessionDeleting = false;
                state.error = action.payload;
            });
    },
});

export default sessionSlice.reducer;