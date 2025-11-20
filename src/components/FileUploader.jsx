import React, { useRef, useState } from "react";
import API from "../services/api";

const FileUploader = ({ taskId, onUploaded }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await API.post(`/tasks/${taskId}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onUploaded) onUploaded(res.data); // tarea actualizada
    } catch (err) {
      console.error("Error subiendo archivo:", err);
      alert("No se pudo subir el archivo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={handleClick}
        className="text-xs text-blue-600 underline disabled:opacity-50"
        disabled={uploading}
      >
        {uploading ? "Subiendo..." : "Adjuntar archivo"}
      </button>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,image/*"
      />
    </div>
  );
};

export default FileUploader;
