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

export const editGmailTemplate = async (formData, id) => {
  return await handleRequest('put', `/api/gmail-template/edit/${id}`, { ...formData });
};

export const editKixieTemplate = async (formData, id)=>{
  return await handleRequest('put', `/api/kixie-template/edit/${id}`, {...formData});
}
const getKixieTemplates = async () => {
  return await handleRequest('get', '/api/kixie-template/list');
};

export const getKixieTemplatesNames = async () => {
  return await handleRequest('get', '/api/kixie-template/names');
};
export const getGmailTemplatesNames = async () => {
  return await handleRequest('get', '/api/gmail-template/names');
};

const templateService = {getGmailTemplates, getKixieTemplates}

export default templateService