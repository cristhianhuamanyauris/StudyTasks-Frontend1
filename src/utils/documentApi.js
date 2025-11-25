const SOCKET_URL = "http://localhost:5000";

const getTokenHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ================================
// ⭐ NUEVO: Obtener todos los docs accesibles
// ================================
export const getAccessibleDocuments = async () => {
  const res = await fetch(`${SOCKET_URL}/api/fileNodes/my-docs`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("No se pudo cargar los documentos accesibles");

  const data = await res.json();

  // los nodos vienen así:
  // { fileNodeId, parent, name, document: {...} }
  // devolvemos solo la parte del documento
  return data.map((item) => ({
    ...item.document,
    fileNodeId: item.fileNodeId,
    parent: item.parent,
    pathName: item.name
  }));
};

export const createDocument = async (title) => {
  const res = await fetch(`${SOCKET_URL}/api/documents`, {
    method: "POST",
    headers: getTokenHeader(),
    body: JSON.stringify({ title }),
  });

  if (!res.ok) throw new Error("No se pudo crear el documento");
  const newDoc = await res.json();
  return newDoc._id;
};

export const getDocument = async (id) => {
  const res = await fetch(`${SOCKET_URL}/api/documents/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("No se pudo cargar el documento");
  return res.json();
};

export const inviteCollaboratorByEmail = async (id, email) => {
  const res = await fetch(`${SOCKET_URL}/api/documents/${id}/collaborators`, {
    method: "POST",
    headers: getTokenHeader(),
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error invitando colaborador");
  return data;
};

export const deleteDocument = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${SOCKET_URL}/api/documents/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "No se pudo eliminar el documento");

  return data;
};
