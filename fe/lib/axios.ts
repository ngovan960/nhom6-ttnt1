import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const axiosClient = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST ================= */
axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ================= RESPONSE ================= */
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const resp = error.response;
    const data = resp?.data;

    if (data) {
      // normalize string/html or object errors into an object with `message`
      const message = typeof data === 'string' ? data : data.message || JSON.stringify(data);
      return Promise.reject({ message, data, status: resp.status });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
