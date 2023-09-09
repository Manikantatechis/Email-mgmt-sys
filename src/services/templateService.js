import { handleRequest } from "./Api"



export const addKixieTemplate = async (formData)=>{
    return await handleRequest('post', '/api/kixie-template/add', {...formData});
}
export const addGmailTemplate = async (formData) => {
  return await handleRequest('post', '/api/gmail-template/add', { ...formData });
};

const getGmailTemplates = async () => {
  return await handleRequest('get', '/api/gmail-template/list');
};

const getKixieTemplates = async () => {
  return await handleRequest('get', '/api/kixie-template/list');
};

const templateService = {getGmailTemplates, getKixieTemplates}

export default templateService