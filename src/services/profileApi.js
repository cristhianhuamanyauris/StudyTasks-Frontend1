// src/services/profileApi.js
import API from "./api";

// Obtener el perfil
export const getMyProfile = () => {
  return API.get("/profile/me");
};

// Actualizar perfil (sin avatar)
export const updateProfile = (data) => {
  return API.put("/profile/update", data);
};

// Subir avatar
export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return API.put("/profile/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
