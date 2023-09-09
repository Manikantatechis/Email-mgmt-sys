import { createAsyncThunk } from "@reduxjs/toolkit";
import templateService from "services/templateService";


export const getGmailTemplates = createAsyncThunk("Gmail/Templates", async(_,{rejectedWithValue})=>{
    try {
        return await templateService.getGmailTemplates()
    } catch (error) {
        rejectedWithValue(error.message)
    }
})


export const getKixieTemplates = createAsyncThunk('Kixie/Templates', async (_, { rejectedWithValue }) => {
  try {
    return await templateService.getKixieTemplates();
  } catch (error) {
    rejectedWithValue(error.message);
  }
});