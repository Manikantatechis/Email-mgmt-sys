// src/thunks/authThunks.js

import authService from "services/authService";
import { createAsyncThunk } from '@reduxjs/toolkit';
// import { toast } from 'react-toastify';


export const loginUser = createAsyncThunk('auth/loginUser', async ({email, password}, { rejectWithValue }) => {
  try {
    console.log(email, password)
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

