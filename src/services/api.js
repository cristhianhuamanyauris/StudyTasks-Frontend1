// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // 👈 para que envíe la cookie refreshToken
});

// 👉 Interceptor de request: agrega el access token al header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Interceptor de response: si el token expiró, intenta refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si fue 401 y no hemos reintentado aún
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Pide nuevo access token usando el refresh token (en cookie)
        const refreshRes = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return API(originalRequest); // reintenta la request original
        }
      } catch (err) {
        console.error("No se pudo refrescar el token:", err);
        localStorage.removeItem("token");
        window.location.href = "/"; // volver al login
      }
    }

    return Promise.reject(error);
  }
);

export default API;
