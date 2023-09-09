import { createSlice } from '@reduxjs/toolkit';
import { getKixieCredentials, getGmailCredentials } from './credentialsThunk';

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState: {
    isKixieLoading: false,
    isGmailLoading: false,
    gmailCredentialsList: [],
    kixieCredentialsList: [],
    iserror: false,
    message: ''
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKixieCredentials.pending, (state) => {
        state.isKixieLoading = true;
      })
      .addCase(getKixieCredentials.fulfilled, (state, action) => {
        state.isKixieLoading = false;
        state.kixieCredentialsList = action.payload;
      })
      .addCase(getKixieCredentials.rejected, (state, action) => {
        state.isKixieLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getGmailCredentials.pending, (state) => {
        state.isGmailLoading = true;
      })
      .addCase(getGmailCredentials.fulfilled, (state, action) => {
        state.isGmailLoading = false;
        state.gmailCredentialsList = action.payload;
      })
      .addCase(getGmailCredentials.rejected, (state, action) => {
        state.isGmailLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});


export const selectKixieCredentialsList = state => state.credentials.kixieCredentialsList
export const selectIsKixieLoading = (state) => state.credentials.isKixieLoading;

export const selectGmailCredentialsList = (state) => state.credentials.gmailCredentialsList;
export const selectIsGmailLoading = (state) => state.credentials.isGmailLoading;


export default credentialsSlice.reducer