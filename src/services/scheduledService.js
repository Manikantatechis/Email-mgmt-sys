import { handleRequest } from './Api';

export const getAllScheduledTasks = async () => {
  return await handleRequest('get', '/api/schedule/list');
};

export const cancelScheduledTask = async (id) => {
  return await handleRequest('delete', `/api/schedule/delete/${id}`);
};

export const getTaskSummary = async (id) => {
  return await handleRequest('get', `/api/schedule/report/${id}`);
};
