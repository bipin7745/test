import axios from "axios";
import backend_url from "./api_url";

// Create axios instance
const api = axios.create({
  baseURL: backend_url,
});

// Add token  every request send
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
