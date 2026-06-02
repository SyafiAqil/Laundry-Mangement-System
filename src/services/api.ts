import axios from "axios";

export const api = axios.create({
  baseURL: "https://laundy-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token");

    console.log("TOKEN:", token);

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
); 