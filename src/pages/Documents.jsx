// src/pages/Documents.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Importamos la función nueva
import {
  createDocument,
  deleteDocument,
  getAccessibleDocuments,
} from "../utils/documentApi";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  // ==========================
  // Cargar documentos
  // ==========================
  const loadDocuments = async () => {
    try {
      const data = await getAccessibleDocuments();
      setDocuments(data);
    } catch (err) {
      console.error("Error cargando documentos:", err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  // Crear documento
  const handleCreate = async () => {
    const title = prompt("Título del documento:");
    if (!title) return;
    try {
      const newId = await createDocument(title);
      navigate(`/documents/${newId}`);
    } catch (err) {
      console.error("Error creando documento:", err);
    }
  };

  // 🗑️ ELIMINAR DOCUMENTO DESDE LA LISTA
  const handleDeleteDocument = async (id, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este documento?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
      alert("Documento eliminado");
    } catch (err) {
      console.error("Error eliminando documento:", err);
      alert("No se pudo eliminar el documento");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis documentos</h1>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCreate}
        >
          Crear documento
        </button>
      </div>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="relative border p-4 rounded bg-white hover:bg-gray-50 transition cursor-pointer"
            onClick={() => navigate(`/documents/${doc._id}`)}
          >
            {/* Botón eliminar */}
            <button
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded hover:bg-red-700"
              onClick={(e) => handleDeleteDocument(doc._id, e)}
            >
              Eliminar
            </button>

            <h2 className="text-xl font-semibold">{doc.title}</h2>
            <p className="text-gray-600 text-sm">
              Colaboradores: {doc.collaborators?.length || 0}
            </p>

            {/* Mostrar el nombre del nodo/carpeta */}
            <p className="text-gray-500 text-xs mt-1">
              Ubicación: {doc.pathName || "Raíz"}
            </p>

            <button
              className="mt-3 bg-green-600 text-white px-3 py-2 rounded"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/documents/${doc._id}`);
              }}
            >
              Abrir
            </button>
          </div>
        ))}

        {documents.length === 0 && (
          <p className="text-gray-500">Aún no tienes documentos creados.</p>
        )}
      </div>
    </div>
  );
}
