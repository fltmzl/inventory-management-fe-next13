import { getAccessToken } from "@/helpers/auth";
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
});

api.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    const accessToken = getAccessToken();

    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export { api };
