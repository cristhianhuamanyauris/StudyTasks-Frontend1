import React from "react";
import FileUploader from "./FileUploader";
import { deleteAttachment } from "../services/api";
import API from "../services/api";

const TaskList = ({
  tasks,
  onToggle,
  onDelete,
  onTaskUpdated,
  onMakeGlobal,
  onEdit,
  onAddSub,
  onToggleSub,
  onDeleteSub,
  normalizeTask,
}) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No hay tareas todavía.</p>;
  }

  const handleDeleteFile = async (taskId, filename) => {
    if (!window.confirm("¿Eliminar este archivo adjunto?")) return;

    try {
      const res = await deleteAttachment(taskId, filename);
      onTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error eliminando archivo:", err);
      alert("No se pudo eliminar el archivo.");
    }
  };

  const handleDeleteSubtaskFile = async (taskId, subId, filename) => {
    if (!window.confirm("¿Eliminar archivo de subtarea?")) return;

    try {
      const res = await API.delete(
        `/tasks/${taskId}/subtasks/${subId}/files/${filename}`
      );
      onTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error eliminando archivo de subtarea", err);
    }
  };

  const uploadSubtaskFile = async (taskId, subId, file) => {
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await API.post(
        `/tasks/${taskId}/subtasks/${subId}/upload`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      onTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error subiendo archivo a subtarea:", err);
    }
  };

  const getSubtaskProgress = (task) => {
    const total = task.subtasks?.length || 0;
    if (!total) return null;

    const done = task.subtasks.filter((s) => s.done).length;
    const percentage = Math.round((done / total) * 100);
    return { total, done, percentage };
  };

  const getUrgencyClass = (task) => {
    if (!task.dueDate) return "bg-gray-50";
    const now = new Date();
    const limit = new Date(task.dueDate);
    const diffHours = (limit - now) / 1000 / 60 / 60;

    if (diffHours < 0) return "bg-red-100";
    if (diffHours < 24) return "bg-orange-100";
    return "bg-gray-50";
  };

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const progress = getSubtaskProgress(task);

        return (
          <div
            key={task._id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between 
              border rounded px-4 py-3 ${getUrgencyClass(task)}
            `}
          >
            {/* Info */}
            <div className="flex-1">
              {/* TÍTULO */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task._id, !task.completed)}
                />

                <span
                  className={`font-medium ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800"
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

                {task.dueDate && (
                  <span className="text-xs ml-2 text-gray-700">
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* PROGRESO SUBTAREAS */}
              {progress && (
                <div className="ml-7 mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        progress.percentage === 100
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {progress.percentage}% completado ({progress.done}/
                    {progress.total})
                  </p>
                </div>
              )}

              {/* SUBTAREAS */}
              {task.subtasks?.length > 0 && (
                <div className="mt-2 ml-7">
                  <p className="text-xs text-gray-500 font-semibold">
                    Subtareas:
                  </p>

                  {task.subtasks.map((sub) => (
                    <div
                      key={sub._id}
                      className="bg-white border rounded p-2 mt-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.done}
                            onChange={() =>
                              onToggleSub(task._id, sub._id, !sub.done)
                            }
                          />
                          <span
                            className={
                              sub.done ? "line-through text-gray-400" : ""
                            }
                          >
                            {sub.text}
                          </span>
                        </div>

                        <button
                          className="text-red-500 text-xs"
                          onClick={() => onDeleteSub(task._id, sub._id)}
                        >
                          Eliminar
                        </button>
                      </div>

                      {/* Archivos */}
                      {sub.attachments?.length > 0 && (
                        <div className="ml-6 mt-2">
                          <p className="text-[11px] text-gray-500">
                            Archivos:
                          </p>

                          {sub.attachments.map((file) => (
                            <div
                              key={file.filename}
                              className="flex justify-between items-center text-xs bg-gray-50 px-2 py-1 rounded border mt-1"
                            >
                              <a
                                href={`http://localhost:5000${file.url}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline"
                              >
                                {file.filename}
                              </a>

                              <button
                                className="text-red-500 ml-4"
                                onClick={() =>
                                  handleDeleteSubtaskFile(
                                    task._id,
                                    sub._id,
                                    file.filename
                                  )
                                }
                              >
                                Eliminar
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Subir archivo */}
                      <div className="ml-6 mt-2">
                        <input
                          type="file"
                          className="text-xs"
                          onChange={(e) =>
                            uploadSubtaskFile(
                              task._id,
                              sub._id,
                              e.target.files[0]
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* AGREGAR SUBTAREA */}
              <div className="ml-7 mt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const text = e.target.sub.value.trim();
                    if (!text) return;
                    onAddSub(task._id, text);
                    e.target.reset();
                  }}
                >
                  <input
                    name="sub"
                    placeholder="Agregar subtarea..."
                    className="border px-2 py-1 text-sm rounded w-full"
                  />
                </form>
              </div>

              {/* ARCHIVOS DE TAREA */}
              {task.attachments?.length > 0 && (
                <div className="mt-3 ml-7">
                  <p className="text-xs text-gray-500">Adjuntos:</p>

                  {task.attachments.map((file) => (
                    <div
                      key={file.filename}
                      className="flex justify-between items-center text-xs bg-white px-2 py-1 rounded border mt-1"
                    >
                      <a
                        href={`http://localhost:5000${file.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.filename}
                      </a>

                      <button
                        className="text-red-500 ml-4"
                        onClick={() =>
                          handleDeleteFile(task._id, file.filename)
                        }
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Subir archivo */}
              <div className="ml-7 mt-2">
                <FileUploader
                  taskId={task._id}
                  onUploaded={(task) =>
                    onTaskUpdated(normalizeTask(task))
                  }
                />
              </div>
            </div>

            {/* BOTONES */}
            <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4">
              <button
                onClick={() => onEdit(task)}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

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
        );
      })}
    </div>
  );
};

export default TaskList;
