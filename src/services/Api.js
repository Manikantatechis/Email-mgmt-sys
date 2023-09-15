import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL
console.log(API_URL)

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
