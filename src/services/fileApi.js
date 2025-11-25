

// src/services/fileApi.js
import API from "./api";

// ===============================
// 📁 Listar nodos (carpetas + archivos + docs)
// ===============================
export const listNodes = async (parent = null) => {
  const res = await API.get(`/files`, {
    params: { parent: parent || null },
  });
  return res.data;
};

// ===============================
// 📁 Crear carpeta
// ===============================
export const createFolder = async (name, parent = null) => {
  const res = await API.post(`/files/folder`, { name, parent });
  return res.data;
};

// ===============================
// 📄 Crear documento colaborativo
// ===============================
export const createDocumentNode = async (name, parent = null) => {
  // BACKEND: POST /api/files/doc
  const res = await API.post(`/files/doc`, {
    title: name,
    parent,
  });

  return res.data;
};

// ===============================
// 📤 Subir archivo (ruta corregida)
// ===============================
export const uploadFile = async (parentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  // BACKEND: POST /api/files/:parentId/upload
  const id = parentId ? parentId : "null";

  const res = await API.post(`/files/${id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ===============================
// 🗑 Eliminar nodo
// ===============================
export const deleteNode = async (id) => {
  const res = await API.delete(`/files/${id}`);
  return res.data;
};

// ===============================
// ✏ Renombrar / mover nodo
// ===============================
export const updateNode = async (id, update) => {
  const res = await API.put(`/files/${id}`, update);
  return res.data;
};

export const getFileTree = async () => {
  const res = await API.get("/files/tree");
  return res.data;
};
