import { createSlice } from "@reduxjs/toolkit";
import {
    loginThunk,
    registerThunk,
    logoutThunk,
    getCurrentUserThunk,
} from "./authThunk";

export { loginThunk, registerThunk, logoutThunk, getCurrentUserThunk };

const initialState = {
    loading: false,
    isAuthenticated: false,
    user: null,
    error: null,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {},

    extraReducers: (builder) => {
        builder

            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload;
            })

            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })

            .addCase(registerThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(registerThunk.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload;
            })

            .addCase(registerThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
            })

            .addCase(logoutThunk.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
                state.error = null;
            })

            .addCase(logoutThunk.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.loading = false;
            })

            .addCase(getCurrentUserThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getCurrentUserThunk.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.loading = false;
                state.user = null;
                state.error = action.payload;
            });
    },
});

export default authSlice.reducer;