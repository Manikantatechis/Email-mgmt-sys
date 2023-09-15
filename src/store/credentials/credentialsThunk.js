import { createAsyncThunk } from '@reduxjs/toolkit';
import credentialService from 'services/credentialsService';

export const getKixieCredentials = createAsyncThunk('kixie/credentials', async (_, { rejectedWithValue }) => {
  try {
    return await credentialService.getKixieCredentials();
  } catch (error) {
    return rejectedWithValue(error.message);
  }
});


export const getGmailCredentials = createAsyncThunk('Gmail / credentials', async (_, { rejectedWithValue }) => {
  try {
    return await credentialService.getGmailCredentials();
  } catch (error) {
    return rejectedWithValue(error.message);
  }
});
