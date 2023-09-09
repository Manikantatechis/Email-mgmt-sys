import { createSlice } from '@reduxjs/toolkit';
import { getGmailTemplates, getKixieTemplates } from './templateThunk';

const templateSlice = createSlice({
  name: 'templates',
  initialState: {
    isKixieLoading: false,
    isGmailLoading: false,
    kixieTemplates: [],
    gmailTemplates: [],
    isError: false,
    message: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getGmailTemplates.pending, (state) => {
        state.isGmailLoading = true;
      })
      .addCase(getGmailTemplates.fulfilled, (state, action) => {
        state.isGmailLoading = false;
        state.gmailTemplates = action.payload;
      })
      .addCase(getGmailTemplates.rejected, (state, action) => {
        state.isGmailLoading = false;
        state.isError = true;
        state.message == action.payload;
      })
      .addCase(getKixieTemplates.pending, (state) => {
        state.isKixieLoading = true;
      })
      .addCase(getKixieTemplates.fulfilled, (state, action) => {
        state.isKixieLoading = false;
        state.kixieTemplates = action.payload;
      })
      .addCase(getKixieTemplates.rejected, (state, action) => {
        state.isKixieLoading = false;
        state.isError = true;
        state.message == action.payload;
      });
  }
});



export const selectIsGmailLoading = state => state.templates.isGmailLoading
export const selectIsKixieLoading = (state) => state.templates.isKixieLoading;
export const selectGmailTemplates = state => state.templates.gmailTemplates
export const selectKixieTemplates = state => state.templates.kixieTemplates





export default templateSlice.reducer
