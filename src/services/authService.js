import { handleRequest } from './Api';

const userLogin = async (email, password) => handleRequest('post', '/api/users/login', {email, password});

export const getUserList = async () => {
  return handleRequest('get', `/api/users/list`);
};

export const checkLogin = async () => handleRequest('get', '/api/users/login-status');

export const userLogout = async () => {
  const data = await handleRequest('get', '/api/users/logout');
  return data;
};

export const addUser = async (formData) => handleRequest('post', '/api/users/register', formData);

export const updateUser = async (formData) => handleRequest('patch', '/api/users/update', formData);

const authService = { userLogin, getUserList,  };

export default authService;
