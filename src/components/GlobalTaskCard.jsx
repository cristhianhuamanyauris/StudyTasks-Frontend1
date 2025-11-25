import React, { useState } from "react";
import { FaUser, FaClock, FaPaperclip, FaSave } from "react-icons/fa";
import API from "../services/api";

export default function GlobalTaskCard({ task }) {
  const [saving, setSaving] = useState(false);

  const total = task.subtasks?.length || 0;
  const done = task.subtasks?.filter((s) => s.done).length || 0;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const due = task.dueDate ? new Date(task.dueDate) : null;

  // ===============================
  // ⭐ Guardar tarea global en Mis tareas
  // ===============================
  const handleSaveTask = async () => {
    if (saving) return;
    setSaving(true);

    try {
      await API.post(`/tasks/${task._id}/duplicate`);
      alert("Tarea guardada en tus tareas ✨");
    } catch (err) {
      console.error("Error duplicando tarea:", err);
      alert("No se pudo guardar la tarea.");
    }

    setSaving(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:shadow-lg transition">

      {/* TÍTULO */}
      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>

      {/* PUBLICADO POR */}
      {task.userId && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <FaUser className="text-gray-500" />
          <span>
            {task.userId.name} ({task.userId.email})
          </span>
        </div>
      )}

      {/* PRIORIDAD */}
      <span
        className={`inline-block mt-2 px-2 py-1 text-xs text-white rounded-full ${
          task.priority === "Alta"
            ? "bg-red-500"
            : task.priority === "Media"
            ? "bg-yellow-500"
            : "bg-green-600"
        }`}
      >
        {task.priority}
      </span>

      {/* FECHA */}
      {due && (
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <FaClock />
          {due.toLocaleDateString()}
        </div>
      )}

      {/* PROGRESO DE SUBTAREAS */}
      {total > 0 && (
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {percent}% ({done}/{total})
          </p>
        </div>
      )}

      {/* ADJUNTOS */}
      {task.attachments?.length > 0 && (
        <div className="mt-3 text-sm">
          <div className="flex items-center gap-2 text-gray-700 mb-1">
            <FaPaperclip className="text-gray-600" />
            <span>Archivos adjuntos:</span>
          </div>

          {task.attachments.map((file, idx) => (
            <a
              key={idx}
              href={`http://localhost:5000${file.url}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline block text-xs"
            >
              {file.filename}
            </a>
          ))}
        </div>
      )}

      {/* BOTÓN GUARDAR */}
      <button
        onClick={handleSaveTask}
        disabled={saving}
        className={`mt-4 w-full flex items-center justify-center gap-2 
          text-white px-3 py-2 rounded text-sm transition 
          ${
            saving
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        <FaSave />
        {saving ? "Guardando..." : "Guardar en mis tareas"}
      </button>
    </div>
  );
}
