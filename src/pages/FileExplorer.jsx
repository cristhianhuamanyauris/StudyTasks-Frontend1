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

  // Abrir nodo
  const handleOpen = (node) => {
    if (node.type === "folder") {
      navigate(`/folder/${node._id}`);
    } else if (node.type === "doc") {
      navigate(`/document/${node.document._id}`);
    } else if (node.type === "file") {
      window.open(`http://localhost:5000${node.file?.url}`, "_blank", "noreferrer");
    }
  };

  // Render recursivo
  const renderNode = (node, level = 0) => {
    return (
      <div key={node._id} className="select-none">
        {/* LÍNEA DE NODO */}
        <div
          className="flex justify-between items-center cursor-pointer 
          bg-[#1E2233] border border-white/10 hover:border-cyan-400/40 
          hover:bg-[#23283A] rounded-lg px-4 py-2 mb-1 transition"
          style={{ marginLeft: level * 20 }}
          onClick={() => handleOpen(node)}
        >
          {/* ICONO + NOMBRE */}
          <div className="text-gray-200 flex items-center gap-2">
            {node.type === "folder" && <span>📁</span>}
            {node.type === "file" && <span>📄</span>}
            {node.type === "doc" && <span>📝</span>}

            <span className="truncate">{node.name}</span>
          </div>

          {/* BOTÓN BORRAR */}
          <button
            className="text-red-400 hover:text-red-300 transition"
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
    <div className="p-8 max-w-4xl mx-auto text-gray-100">

      {/* TITULO */}
      <h1 className="text-4xl font-extrabold text-cyan-400 mb-8 tracking-wide">
        Mis documentos
      </h1>

      {/* BOTONES */}
      <div className="flex flex-wrap gap-3 mb-6">

        {/* NUEVA CARPETA */}
        <button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 
          text-white shadow-lg hover:opacity-90 active:scale-95 transition"
          onClick={() => setShowCreateFolder(true)}
        >
          📁 Nueva carpeta
        </button>

        {/* NUEVO DOCUMENTO */}
        <button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 
          text-white shadow-lg hover:opacity-90 active:scale-95 transition"
          onClick={() => {
            const title = prompt("Título del documento:");
            if (title) createDocumentNode(title, null).then(loadTree);
          }}
        >
          📝 Nuevo documento
        </button>

        {/* SUBIR ARCHIVO */}
        <label
          className="px-4 py-2 rounded-lg bg-[#1E2233] border border-white/10 
          cursor-pointer hover:border-cyan-400/40 hover:bg-[#23283A] transition shadow"
        >
          📤 Subir archivo
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

      {/* TREE VIEW */}
      <div className="mt-6 space-y-1">
        {tree.map((node) => renderNode(node))}
      </div>
    </div>
  );
}
