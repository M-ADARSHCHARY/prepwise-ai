import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/users/login', data);
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const registerThunk = createAsyncThunk(
    "auth/register",
    async (data, thunkAPI) => {
        try{
            const res = await axiosInstance.post('/users/register', data);
            return res.data.data;
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/users/logout');
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);

export const getCurrentUserThunk = createAsyncThunk(
    "auth/currentUser",
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/users/me');
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data);
        }
    }
);