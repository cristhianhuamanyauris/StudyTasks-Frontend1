import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ==============================
// 🔐 INTERCEPTOR: TOKEN JWT
// ==============================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data.token;

        if (newToken) {
          localStorage.setItem("token", newToken);
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return API(originalRequest);
        }
      } catch (err) {
        console.error("No se pudo refrescar token:", err);
        localStorage.removeItem("token");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

/* ============================================================
    📌 ARCHIVOS DE TAREA
   ============================================================ */
export const deleteAttachment = (taskId, filename) =>
  API.delete(`/tasks/${taskId}/files/${filename}`);

/* ============================================================
    📌 SUBTAREAS (CRUD)
   ============================================================ */
export const addSubtask = (taskId, text) =>
  API.post(`/tasks/${taskId}/subtasks`, { text });

export const toggleSubtask = (taskId, subId, done) =>
  API.put(`/tasks/${taskId}/subtasks/${subId}`, { done });

export const deleteSubtask = (taskId, subId) =>
  API.delete(`/tasks/${taskId}/subtasks/${subId}`);

/* ============================================================
    📌 ARCHIVOS DE SUBTAREA (NUEVO)
   ============================================================ */

// ⭐ Subir archivo a subtarea
export const uploadSubtaskFile = (taskId, subId, file) => {
  const form = new FormData();
  form.append("file", file);

  return API.post(
    `/tasks/${taskId}/subtasks/${subId}/upload`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

// ⭐ Eliminar archivo de subtarea
export const deleteSubtaskFile = (taskId, subId, filename) =>
  API.delete(`/tasks/${taskId}/subtasks/${subId}/files/${filename}`);

export default API;
