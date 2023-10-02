// src/slices/authSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { listUsers, loginUser } from './authThunks';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    userList: []
  },
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('userData'); // Remove user data from localStorage
      localStorage.removeItem('userRole'); // Remove user role from localStorage
      localStorage.removeItem("month")
      localStorage.removeItem("week")

    },
    loginStatus: (state, action) => {
      state.isAuthenticated = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;

        // Save user data and role in localStorage
        const { _id, email, first_name, last_name, notifications } = action.payload;
        localStorage.setItem('userData', JSON.stringify({ _id, email, first_name, last_name }));
        localStorage.setItem('userNotifications', JSON.stringify(notifications));

        

        localStorage.setItem('userRole', action.payload.role);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(listUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(listUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload;
      })
      .addCase(listUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const selectUser = (state) => state.auth.user;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export const selectIsLoading = (state) => state.auth.isLoading;

export const selectError = (state) => state.auth.error;

export const selectUserList = (state) => state.auth.userList;

export const { logoutUser, loginStatus } = authSlice.actions;

export default authSlice.reducer;
