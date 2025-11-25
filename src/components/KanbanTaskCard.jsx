import React from "react";
import { FaEdit, FaTrash, FaGlobe, FaClock } from "react-icons/fa";

export default function KanbanTaskCard({ task, onEdit, onDelete, onMakeGlobal }) {
  const total = task.subtasks?.length || 0;
  const done = task.subtasks?.filter((s) => s.done).length || 0;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const due = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <div
      className="glass rounded-xl px-4 py-3 mb-4 border border-cyan-400/20 
      shadow-lg hover:shadow-cyan-400/20 transition-all duration-300"
    >
      {/* Título + prioridad */}
      <div className="flex justify-between items-center gap-3">
        <h3 className="font-semibold text-cyan-200 text-sm md:text-base truncate">
          {task.title}
        </h3>

        <span
          className={`text-[10px] px-2 py-1 rounded-full text-white
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
      </div>

      {/* Fecha límite */}
      {due && (
        <div className="flex items-center gap-2 text-[11px] text-gray-300 mt-1">
          <FaClock className="text-cyan-300/80" />
          <span>{due.toLocaleDateString()}</span>
        </div>
      )}

      {/* Progreso subtareas */}
      {total > 0 && (
        <div className="mt-2">
          <div className="w-full h-2 bg-black/30 rounded overflow-hidden">
            <div
              className="h-2 bg-cyan-400 rounded transition-all"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {percent}% ({done}/{total})
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex justify-end gap-3 mt-3 text-sm">

        <button
          className="text-blue-400 hover:text-blue-300 active:scale-95 transition"
          onClick={() => onEdit(task)}
          title="Editar"
        >
          <FaEdit />
        </button>

        <button
          className="text-purple-400 hover:text-purple-300 active:scale-95 transition"
          onClick={() => onMakeGlobal(task._id)}
          title="Publicar como global"
        >
          <FaGlobe />
        </button>

        <button
          className="text-red-400 hover:text-red-300 active:scale-95 transition"
          onClick={() => onDelete(task._id)}
          title="Eliminar"
        >
          <FaTrash />
        </button>

      </div>
    </div>
  );
}
