import { handleRequest } from "./Api"



export const getAllScheduledTasks = async()=>{
    return  await handleRequest("get", "/api/schedule/list")
}