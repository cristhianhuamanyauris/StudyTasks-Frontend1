// src/pages/FileExplorer.jsx
import React, { useEffect, useState } from "react";
import {
  createFolder,
  createDocumentNode,
  uploadFile,
  deleteNode,
  getFileTree
} from "../services/fileApi";
import { useNavigate } from "react-router-dom";

export default function FileExplorer() {
  const [tree, setTree] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState("");

  const navigate = useNavigate();

  const loadTree = async () => {
    const data = await getFileTree();
    setTree(data);
  };

  useEffect(() => {
    loadTree();
  }, []);

  // Crear carpeta en raíz
  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;

    await createFolder(folderName.trim(), null);

    setFolderName("");
    setShowCreateFolder(false);
    loadTree();
  };

  // Abrir nodo segun su tipo
  const handleOpen = (node) => {
    if (node.type === "folder") {
      navigate(`/folder/${node._id}`);
    } else if (node.type === "doc") {
      navigate(`/document/${node.document._id}`);
    } else if (node.type === "file") {
      window.open(`http://localhost:5000${node.file?.url}`, "_blank");
    }
  };

  // Render recursivo
  const renderNode = (node, level = 0) => {
    return (
      <div key={node._id} style={{ marginLeft: level * 20 }}>
        {/* NODO */}
        <div
          className="p-2 border rounded my-1 cursor-pointer hover:bg-gray-100 bg-white flex justify-between"
          onClick={() => handleOpen(node)}
        >
          <span>
            {node.type === "folder" && "📁 "}
            {node.type === "file" && "📄 "}
            {node.type === "doc" && "📝 "}
            {node.name}
          </span>

          {/* ELIMINAR */}
          <button
            className="text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("¿Eliminar este elemento?")) {
                deleteNode(node._id).then(loadTree);
              }
            }}
          >
            ✖
          </button>
        </div>

        {/* HIJOS */}
        {node.children?.map((child) => renderNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mis documentos</h1>

      {/* BOTONES */}
      <div className="flex gap-3 mb-4">

        {/* NUEVA CARPETA */}
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => setShowCreateFolder(true)}
        >
          Nueva carpeta
        </button>

        {/* NUEVO DOCUMENTO */}
        <button
          className="bg-green-500 text-white px-3 py-1 rounded"
          onClick={() => {
            const title = prompt("Título del documento:");
            if (title) createDocumentNode(title, null).then(loadTree);
          }}
        >
          Nuevo documento
        </button>

        {/* SUBIR ARCHIVO */}
        <label className="bg-gray-700 text-white px-3 py-1 rounded cursor-pointer">
          Subir archivo
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files[0]) {
                uploadFile(null, e.target.files[0]).then(loadTree);
              }
            }}
          />
        </label>
      </div>

      {/* FORMULARIO CREAR CARPETA */}
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

      {/* ÁRBOL COMPLETO */}
      {tree.map((node) => renderNode(node))}
    </div>
  );
}
