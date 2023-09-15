import { handleRequest } from "./Api";



export const sendMessage  = async (formData) => handleRequest('post', '/api/message/send', formData );