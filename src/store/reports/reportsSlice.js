import { createSlice } from '@reduxjs/toolkit';
import { getEmailReport, getSMSReport} from './reportsThunk';

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  weeklyEmailReport: {},
  monthlyEmailReport: {},
  smsData:[]
};

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSMSReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSMSReport.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
        localStorage.setItem("smsData", JSON.stringify(payload));
        state.smsData = payload
      })
      .addCase(getSMSReport.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload;
      })
      .addCase(getEmailReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEmailReport.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.weeklyEmailReport = payload.slot === 'week' ? payload.report : {};
        state.monthlyEmailReport = payload.slot === 'month' ? payload.report : {};
        localStorage.setItem(payload.slot, JSON.stringify(payload.report));
      })
      .addCase(getEmailReport.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = payload;
      });
  }
});

// export const {} = reportsSlice.actions

export const selectIsLoading = (state) => state.reports.isLoading;
export const selectWeeklyEmailReport = (state) => state.reports.weeklyEmailReport;
export const selectMonthlyEmailReport = (state) => state.reports.monthlyEmailReport;

export default reportsSlice.reducer;
