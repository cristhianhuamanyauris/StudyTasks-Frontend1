import React from "react";
import { FaEdit, FaTrash, FaGlobe, FaClock } from "react-icons/fa";

export default function KanbanTaskCard({ task, onEdit, onDelete, onMakeGlobal }) {
  const total = task.subtasks?.length || 0;
  const done = task.subtasks?.filter(s => s.done).length || 0;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const due = task.dueDate ? new Date(task.dueDate) : null;

  return (
    <div className="bg-white rounded-lg shadow px-4 py-3 mb-4 border border-gray-200">

      {/* Título + prioridad */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">{task.title}</h3>

        <span className={`text-xs px-2 py-1 rounded-full text-white ${
          task.priority === "Alta"
            ? "bg-red-500"
            : task.priority === "Media"
            ? "bg-yellow-500"
            : "bg-green-600"
        }`}>
          {task.priority}
        </span>
      </div>

      {/* Fecha límite */}
      {due && (
        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
          <FaClock className="text-gray-400" />
          {due.toLocaleDateString()}
        </div>
      )}

      {/* Progreso subtareas */}
      {total > 0 && (
        <div className="mt-2">
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

      {/* Acciones */}
      <div className="flex justify-end gap-3 mt-3 text-lg">

        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => onEdit(task)}
        >
          <FaEdit />
        </button>

        <button
          className="text-purple-600 hover:text-purple-800"
          onClick={() => onMakeGlobal(task._id)}
        >
          <FaGlobe />
        </button>

        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => onDelete(task._id)}
        >
          <FaTrash />
        </button>

      </div>
    </div>
  );
}
