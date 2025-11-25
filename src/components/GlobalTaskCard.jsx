import React, { useState } from "react";
import { FaUser, FaClock, FaPaperclip, FaSave } from "react-icons/fa";
import API from "../services/api";

export default function GlobalTaskCard({ task }) {
  const [saving, setSaving] = useState(false);

  const total = task.subtasks?.length || 0;
  const done = task.subtasks?.filter((s) => s.done).length || 0;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const due = task.dueDate ? new Date(task.dueDate) : null;

  const handleSaveTask = async () => {
    if (saving) return;
    setSaving(true);

    try {
      await API.post(`/tasks/${task._id}/duplicate`);
      alert("✨ Tarea guardada en tus tareas");
    } catch (err) {
      console.error("Error duplicando tarea:", err);
      alert("⚠️ No se pudo guardar la tarea.");
    }

    setSaving(false);
  };

  return (
    <div
      className="glass p-5 rounded-xl border border-cyan-400/20 shadow-xl 
        hover:shadow-cyan-400/20 transition-all duration-300"
    >
      {/* TÍTULO */}
      <h3 className="text-xl font-bold text-cyan-300 tracking-wide">
        {task.title}
      </h3>

      {/* PUBLICADO POR */}
      {task.userId && (
        <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
          <FaUser className="text-cyan-300/70" />
          <span className="opacity-80">
            {task.userId.name} ({task.userId.email})
          </span>
        </div>
      )}

      {/* PRIORIDAD */}
      <span
        className={`inline-block mt-3 px-2 py-1 text-xs text-white rounded-full 
          ${
            task.priority === "Alta"
              ? "bg-red-600"
              : task.priority === "Media"
              ? "bg-yellow-500"
              : "bg-green-600"
          }`}
      >
        {task.priority}
      </span>

      {/* FECHA */}
      {due && (
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-300">
          <FaClock className="text-cyan-300" />
          {due.toLocaleDateString()}
        </div>
      )}

      {/* PROGRESO SUBTAREAS */}
      {total > 0 && (
        <div className="mt-4">
          <div className="w-full h-2 bg-black/30 rounded overflow-hidden">
            <div
              className="h-2 bg-cyan-400 rounded transition-all"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {percent}% ({done}/{total})
          </p>
        </div>
      )}

      {/* ADJUNTOS */}
      {task.attachments?.length > 0 && (
        <div className="mt-4 text-sm">
          <div className="flex items-center gap-2 text-cyan-300 mb-1">
            <FaPaperclip />
            <span className="text-gray-300">Archivos:</span>
          </div>

          {task.attachments.map((file, idx) => (
            <a
              key={idx}
              href={`http://localhost:5000${file.url}`}
              target="_blank"
              rel="noreferrer"
              className="text-cyan-300 underline block text-xs hover:text-cyan-200"
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
        className={`mt-5 w-full flex items-center justify-center gap-2 
          px-4 py-2 rounded-lg text-sm font-semibold transition
          text-black
          ${
            saving
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-cyan-300 hover:bg-cyan-200 shadow-md hover:shadow-cyan-300/30"
          }`}
      >
        <FaSave />
        {saving ? "Guardando..." : "Guardar en mis tareas"}
      </button>
    </div>
  );
}
