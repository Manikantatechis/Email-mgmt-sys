import { handleRequest } from "./Api";

const getEmailReport = async(slot)=>{
    return handleRequest("get", `/reports/email?slot=${slot}`)
}


const getSMSReport = async()=>{
    return handleRequest("get", `/reports/sms`)
}




const reportService = {getEmailReport, getSMSReport}


export default reportService