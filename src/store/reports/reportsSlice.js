import { createSlice } from '@reduxjs/toolkit';
import { getEmailReport, getSMSReport } from './reportsThunk';

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  weeklyEmailReport: {},
  monthlyEmailReport: {},
  totalEmailsOpened: 0,
  totalEmailsSent: 0,
  totalSMSSent: 0,
  smsData: []
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
        state.smsData = payload.weekData;
        state.totalSMSSent = payload.totalSMSSentAllTime;
        localStorage.setItem('smsData', JSON.stringify(payload.weekData));
        localStorage.setItem('totalSMSSent', JSON.stringify(payload.totalSMSSentAllTime));
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
        state.totalEmailsOpened = payload.report.totalEmailsOpenedAllTime;
        state.totalEmailsSent = payload.report.totalEmailsSentAllTime;
        localStorage.setItem(payload.slot, JSON.stringify(payload.report));
        localStorage.setItem(`totalEmailsOpened`, JSON.stringify(payload.report.totalEmailsOpenedAllTime));
        localStorage.setItem(`totalEmailsSent`, JSON.stringify(payload.report.totalEmailsSentAllTime));
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
export const selectTotalEmailsSent = (state) => state.reports.totalEmailsSent;
export const selectTotalEmailsOpened = (state) => state.reports.totalEmailsOpened;
export const selectTotalSMSSent = (state) => state.reports.totalSMSSent;

export default reportsSlice.reducer;
