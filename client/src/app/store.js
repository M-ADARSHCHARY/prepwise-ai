import { configureStore } from "@reduxjs/toolkit";
import codingProblemReducer from "../redux/codingProblem/codingProblemSlice";
import authReducer from "../redux/auth/authSlice";
import sessionReducer from "../redux/session/sessionSlice";
import roadmapReducer from "../redux/roadmap/roadmapSlice";
import assessmentReducer from "../redux/assessment/assessmentSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        session: sessionReducer,
        roadmap: roadmapReducer,
        assessment: assessmentReducer,
        codingProblem: codingProblemReducer,
    },
});