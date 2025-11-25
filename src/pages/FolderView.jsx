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

  const handleOpen = (node) => {
    if (node.type === "folder") {
      navigate(`/folder/${node._id}`);
    } else if (node.type === "doc") {
      navigate(`/document/${node.documentId}`);
    } else if (node.type === "file") {
      window.open(`http://localhost:5000${node.file.url}`, "_blank", "noreferrer");
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    await createFolder(folderName.trim(), parentId);
    setFolderName("");
    setShowCreateFolder(false);
    loadFolder();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-100">

      {/* Regresar */}
      <button
        className="mb-6 text-cyan-300 hover:text-cyan-400 transition"
        onClick={() => navigate(-1)}
      >
        ← Regresar
      </button>

      <h1 className="text-4xl font-extrabold text-cyan-400 mb-8 tracking-wide">
        Carpeta
      </h1>

      {/* BOTONES SUPERIORES */}
      <div className="flex flex-wrap gap-3 mb-6">

        <button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 
          text-white shadow-md hover:opacity-90 active:scale-95 transition"
          onClick={() => setShowCreateFolder(true)}
        >
          📁 Nueva carpeta
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 
          text-white shadow-md hover:opacity-90 active:scale-95 transition"
          onClick={() => {
            const title = prompt("Título del documento:");
            if (title) createDocumentNode(title, parentId).then(loadFolder);
          }}
        >
          📝 Nuevo documento
        </button>

        <label
          className="px-4 py-2 rounded-lg bg-[#1E2233] border border-white/10 cursor-pointer 
          hover:border-cyan-400/40 hover:bg-[#23283A] transition shadow"
        >
          📤 Subir archivo
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

      {/* CREAR CARPETA */}
      {showCreateFolder && (
        <div className="mb-6 bg-white/5 backdrop-blur-lg border border-white/10 
        rounded-lg p-4 shadow-lg">
          <input
            placeholder="Nombre de la carpeta"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="bg-[#1E2233] text-gray-100 px-4 py-2 rounded-lg border 
            border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
            focus:ring-cyan-500 transition w-64"
          />

          <button
            className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 
            text-white hover:opacity-90 active:scale-95 transition"
            onClick={handleCreateFolder}
          >
            Crear
          </button>

          <button
            className="ml-3 text-gray-400 hover:text-gray-300 transition"
            onClick={() => setShowCreateFolder(false)}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* LISTA DE ELEMENTOS */}
      <div className="space-y-2 mt-4">
        {nodes.map((node) => (
          <div
            key={node._id}
            className="flex justify-between items-center px-4 py-3 
            bg-[#1E2233] rounded-lg border border-white/10 hover:border-cyan-400/40 
            hover:bg-[#23283A] cursor-pointer transition"
            onClick={() => handleOpen(node)}
          >
            <div className="text-gray-200 flex items-center gap-2">
              {node.type === "folder" && <span>📁</span>}
              {node.type === "file" && <span>📄</span>}
              {node.type === "doc" && <span>📝</span>}

              <span className="truncate">{node.name}</span>
            </div>

            <button
              className="text-red-400 hover:text-red-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("¿Eliminar este elemento?")) {
                  deleteNode(node._id).then(loadFolder);
                }
              }}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
