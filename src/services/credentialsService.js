import { handleRequest } from "./Api"

const getKixieCredentials = async()=>{
    return await handleRequest('get', '/api/kixie-credentials/list');
}

const getGmailCredentials = async () => {
  return await handleRequest('get', '/api/gmail-credentials/list');
};
export const addGmailCred = async (formData)=>{
  return await handleRequest('post', '/api/gmail-credentials/add', {...formData});
}
export const addKixieCred = async (formData) => {
  return await handleRequest('post', '/api/kixie-credentials/add', { ...formData });
};


export const getKixieCredNames = async()=>{
  return await handleRequest('get', '/api/kixie-credentials/names');
}
export const getGmailCredNames = async()=>{
   return await handleRequest('get', '/api/gmail-credentials/emails');
}

export const editGmailCred = async(formData, id)=>{
  return await handleRequest('patch', `/api/gmail-credentials/edit/${id}`, {...formData})
}

export const editKixieCred = async(formData, id)=>{
  return await handleRequest('patch', `/api/kixie-credentials/edit/${id}`, {...formData})
}




const credentialService = { getKixieCredentials, getGmailCredentials };

export default credentialService