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
export const deleteGmailTemplate = async (id) => {
  return await handleRequest('delete', `/api/gmail-template/delete/${id}`);
};

export const editKixieTemplate = async (formData, id)=>{
  return await handleRequest('put', `/api/kixie-template/edit/${id}`, {...formData});
}

export const deleteKixieTemplate = async (id)=>{
  return await handleRequest('delete', `/api/kixie-template/delete/${id}`);
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