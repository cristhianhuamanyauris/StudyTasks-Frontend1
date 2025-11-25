import React, { useRef, useState } from "react";
import API from "../services/api";

const FileUploader = ({ taskId, onUploaded }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const normalizeTask = (data) => (data?.task ? data.task : data);

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

      if (onUploaded) onUploaded(normalizeTask(res.data));
    } catch (err) {
      console.error("Error subiendo archivo:", err);
      alert("No se pudo subir el archivo");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className={`
          text-xs px-3 py-1 rounded 
          text-cyan-300 hover:text-cyan-200 
          transition active:scale-95
          ${uploading ? "opacity-50 cursor-not-allowed" : "hover:underline"}
        `}
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
