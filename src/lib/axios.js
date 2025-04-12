import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://speakflow-backend.onrender.com',
  withCredentials: true,
});
