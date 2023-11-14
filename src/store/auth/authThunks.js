import authService from "services/authService";
import { createAsyncThunk } from '@reduxjs/toolkit';


export const loginUser = createAsyncThunk('auth/loginUser', async ({email, password}, { rejectWithValue }) => {
  try {
    return await authService.userLogin(email, password);
  } catch (error) {
    return rejectWithValue(message);
  }
});



export const listUsers = createAsyncThunk('auth/listUsers', async (_, { rejectWithValue }) => {
    try {
      return await authService.getUserList();
    } catch (error) {
      return rejectWithValue(message);
    }
});

