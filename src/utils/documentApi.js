// src/utils/DocumentApi.js
const SOCKET_URL = "http://localhost:5000";

export const createDocument = async (title) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${SOCKET_URL}/api/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error("No se pudo crear el documento");

  const newDoc = await res.json();
  return newDoc._id; // ID para abrir en DocumentEditor
};
