import axios from 'axios';

const API_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const handleRequest = async (method, url, data = {}) => {
  try {
    const res = await axiosInstance[method](url, data);
    return res.data;
  } catch (error) {
    const message =
      (error.message && error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    console.log(message);
    throw new Error(message);
  }
};
