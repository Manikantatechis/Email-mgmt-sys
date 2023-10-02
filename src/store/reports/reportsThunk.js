import { createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "services/reportsService";



export const getEmailReport = createAsyncThunk(
    "reports/email", async(slot, { rejectedWithValue })=>{
        try {
            const res = await reportService.getEmailReport(slot)
            return {slot, report:res}
        } catch (error) {
            return rejectedWithValue(error)
        }
    }
)



export const getSMSReport = createAsyncThunk(
    "reports/sms", async(_, { rejectedWithValue })=>{
        try {
            const res = await reportService.getSMSReport()
            return res
        } catch (error) {
            return rejectedWithValue(error)
        }
    }
)

