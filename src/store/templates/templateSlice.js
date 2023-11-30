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
  reducers: {
    addTemplate:(state, action)=>{
      if(action.payload.type === "gmail"){
        state.gmailTemplates = [...state.gmailTemplates, action.payload.template]
      }
      if(action.payload.type === "kixie"){
        state.kixieTemplates = [...state.kixieTemplates, action.payload.template]
      }
    },
    editTemplate: (state, action) => {
      if (action.payload.type === "gmail") {
        state.gmailTemplates = state.gmailTemplates.map((template) => {
          if (template._id === action.payload.template._id) {
            return action.payload.template; 
          }
          return template;
        });
      }
      if (action.payload.type === "kixie") {
        state.kixieTemplates = state.kixieTemplates.map((template) => {
          if (template._id === action.payload.template._id) {
            return action.payload.template;
          }
          return template;
        });
      }
    },
    deleteTemplate: (state, action) => {
      if (action.payload.type === "gmail") {
        state.gmailTemplates = state.gmailTemplates.filter(template => template._id !== action.payload.id);
      }
      if (action.payload.type === "kixie") {
        state.kixieTemplates = state.kixieTemplates.filter(template => template._id !== action.payload.id);
      }
    }
    
    
        
  },
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




export const {addTemplate, editTemplate, deleteTemplate} = templateSlice.actions




export default templateSlice.reducer
