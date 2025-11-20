import React from "react";
import FileUploader from "./FileUploader";

const TaskList = ({
  tasks,
  onToggle,
  onDelete,
  onTaskUpdated,
  onMakeGlobal,
}) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No hay tareas todavía.</p>;
  }

  const handleCheckboxChange = (task) => {
    onToggle(task._id, !task.completed);
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 border rounded px-4 py-3"
        >
          {/* Izquierda: título + prioridad + adjuntos */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCheckboxChange(task)}
              />

              <span
                className={`font-medium ${
                  task.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.title}
              </span>

              {task.priority && (
                <span
                  className={`text-xs px-2 py-1 rounded-full text-white ${
                    task.priority === "Alta"
                      ? "bg-red-500"
                      : task.priority === "Media"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                >
                  {task.priority}
                </span>
              )}
            </div>

            {/* Adjuntos */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="mt-1 ml-7">
                <p className="text-xs text-gray-500">Adjuntos:</p>
                {task.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:5000${file.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs text-blue-600 underline"
                  >
                    {file.filename}
                  </a>
                ))}
              </div>
            )}

            {/* Uploader de archivos */}
            <div className="ml-7">
              <FileUploader taskId={task._id} onUploaded={onTaskUpdated} />
            </div>
          </div>

          {/* Derecha: botones */}
          <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4">
            <button
              onClick={() => onMakeGlobal(task._id)}
              className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded"
            >
              Publicar global
            </button>

            <button
              onClick={() => onDelete(task._id)}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
