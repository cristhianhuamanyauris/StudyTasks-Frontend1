// src/pages/FolderView.jsx
import React, { useEffect, useState } from "react";
import {
  listNodes,
  createFolder,
  createDocumentNode,
  uploadFile,
  deleteNode,
} from "../services/fileApi";
import { useParams, useNavigate } from "react-router-dom";

export default function FolderView() {
  const { id: parentId } = useParams();
  const [nodes, setNodes] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const navigate = useNavigate();

  const loadFolder = async () => {
    const data = await listNodes(parentId);
    setNodes(data);
  };

  useEffect(() => {
    loadFolder();
  }, [parentId]);

  // Abrir nodos
  const handleOpen = (node) => {
    if (node.type === "folder") {
      navigate(`/folder/${node._id}`);
    } else if (node.type === "doc") {
      navigate(`/document/${node.documentId}`);
    } else if (node.type === "file") {
      window.open(`http://localhost:5000${node.file.url}`, "_blank");
    }
  };

  // Crear carpeta
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    await createFolder(folderName.trim(), parentId);
    setFolderName("");
    setShowCreateFolder(false);
    loadFolder();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <button
        className="mb-4 text-blue-600 underline"
        onClick={() => navigate(-1)}
      >
        ← Regresar
      </button>

      <h1 className="text-2xl font-bold mb-4">Carpeta</h1>

      {/* BOTONES */}
      <div className="flex gap-3 mb-4">
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => setShowCreateFolder(true)}
        >
          Nueva carpeta
        </button>

        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => {
            const title = prompt("Título del documento:");
            if (title) createDocumentNode(title, parentId).then(loadFolder);
          }}
        >
          Nuevo documento
        </button>

        {/* ⭐ SUBIDA DE ARCHIVOS (CORREGIDO) */}
        <label className="bg-gray-700 text-white px-3 py-1 rounded cursor-pointer">
          Subir archivo
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) {
                uploadFile(parentId, e.target.files[0]).then(loadFolder);
              }
            }}
          />
        </label>
      </div>

      {/* Crear carpeta */}
      {showCreateFolder && (
        <div className="mb-4">
          <input
            placeholder="Nombre de la carpeta"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            className="bg-blue-600 text-white px-3 py-1 ml-2 rounded"
            onClick={handleCreateFolder}
          >
            Crear
          </button>

          <button
            className="ml-2 text-gray-500"
            onClick={() => setShowCreateFolder(false)}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* LISTA */}
      <div className="space-y-3">
        {nodes.map((node) => (
          <div
            key={node._id}
            className="p-3 border rounded cursor-pointer hover:bg-gray-100 flex justify-between"
            onClick={() => handleOpen(node)}
          >
            <span>
              {node.type === "folder" && "📁 "}
              {node.type === "file" && "📄 "}
              {node.type === "doc" && "📝 "}
              {node.name}
            </span>

            <button
              className="text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Eliminar?")) {
                  deleteNode(node._id).then(loadFolder);
                }
              }}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
