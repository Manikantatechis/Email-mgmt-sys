import { handleRequest } from './Api';

export const getAllScheduledTasks = async (pageSize, page) => {
  return await handleRequest('get', `/api/schedule/list?pageSize=${pageSize}&&page=${page}`);
};

export const cancelScheduledTask = async (id) => {
  return await handleRequest('delete', `/api/schedule/delete/${id}`);
};

export const getTaskSummary = async (id) => {
  return await handleRequest('get', `/api/schedule/report/${id}`);
};
