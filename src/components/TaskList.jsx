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
    return (
      <p className="text-gray-400 text-center py-6 italic">
        No hay tareas todavía.
      </p>
    );
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

  const urgencyColor = (task) => {
    if (!task.dueDate) return "border-white/10";

    const now = new Date();
    const limit = new Date(task.dueDate);
    const diff = (limit - now) / (1000 * 60 * 60);

    if (diff < 0) return "border-red-500/40";
    if (diff < 24) return "border-yellow-500/40";
    return "border-white/10";
  };

  return (
    <div className="space-y-6">
      {tasks.map((task) => {
        const progress = getSubtaskProgress(task);

        return (
          <div
            key={task._id}
            className={`bg-white/5 backdrop-blur-xl border ${urgencyColor(
              task
            )} rounded-xl p-6 shadow-lg transition`}
          >
            {/* ---------- HEADER ---------- */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggle(task._id, !task.completed)}
                  className="w-5 h-5 accent-cyan-400"
                />

                <span
                  className={`text-lg font-semibold ${
                    task.completed
                      ? "line-through text-gray-500"
                      : "text-gray-100"
                  }`}
                >
                  {task.title}
                </span>

                {task.priority && (
                  <span
                    className={`text-xs px-2 py-1 rounded-lg text-white ${
                      task.priority === "Alta"
                        ? "bg-red-600/70"
                        : task.priority === "Media"
                        ? "bg-yellow-600/70"
                        : "bg-green-600/70"
                    }`}
                  >
                    {task.priority}
                  </span>
                )}

                {task.dueDate && (
                  <span className="text-xs text-gray-400 ml-1">
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(task)}
                  className="text-xs px-3 py-1 rounded bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:bg-blue-600/50 transition"
                >
                  Editar
                </button>

                <button
                  onClick={() => onMakeGlobal(task._id)}
                  className="text-xs px-3 py-1 rounded bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:bg-purple-600/50 transition"
                >
                  Publicar
                </button>

                <button
                  onClick={() => onDelete(task._id)}
                  className="text-xs px-3 py-1 rounded bg-red-600/30 border border-red-500/40 text-red-300 hover:bg-red-600/50 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {/* ---------- PROGRESO ---------- */}
            {progress && (
              <div className="mt-4">
                <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      progress.percentage === 100
                        ? "bg-green-400"
                        : "bg-cyan-400"
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {progress.percentage}% completado ({progress.done}/
                  {progress.total})
                </p>
              </div>
            )}

            {/* ---------- SUBTAREAS ---------- */}
            <div className="mt-5 space-y-3">
              {task.subtasks?.length > 0 && (
                <p className="text-sm text-cyan-300 font-semibold">Subtareas</p>
              )}

              {task.subtasks?.map((sub) => (
                <div
                  key={sub._id}
                  className="bg-[#1E2233] border border-white/10 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sub.done}
                        onChange={() =>
                          onToggleSub(task._id, sub._id, !sub.done)
                        }
                        className="accent-cyan-400"
                      />
                      <span
                        className={`text-sm ${
                          sub.done
                            ? "text-gray-500 line-through"
                            : "text-gray-200"
                        }`}
                      >
                        {sub.text}
                      </span>
                    </label>

                    <button
                      className="text-red-400 text-xs hover:text-red-300"
                      onClick={() => onDeleteSub(task._id, sub._id)}
                    >
                      Eliminar
                    </button>
                  </div>

                  {/* Archivos de subtarea */}
                  {sub.attachments?.length > 0 && (
                    <div className="mt-2 ml-6">
                      <p className="text-[11px] text-gray-400">Archivos:</p>

                      {sub.attachments.map((file) => (
                        <div
                          key={file.filename}
                          className="flex justify-between text-xs bg-[#151821] border border-white/10 px-2 py-1 rounded mt-1"
                        >
                          <a
                            href={`http://localhost:5000${file.url}`}
                            target="_blank"
                            className="text-cyan-400 underline"
                          >
                            {file.filename}
                          </a>

                          <button
                            className="text-red-400 hover:text-red-300 ml-3"
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
                  <div className="mt-2 ml-6">
                    <input
                      type="file"
                      className="text-xs text-gray-300"
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

            {/* ---------- AGREGAR SUBTAREA ---------- */}
            <form
              className="mt-4"
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
                placeholder="➕ Agregar subtarea..."
                className="w-full bg-[#1E2233] border border-[#2A2F43] text-gray-200 
                px-3 py-2 rounded-lg text-sm focus:border-cyan-400 focus:ring-2
                focus:ring-cyan-500 transition"
              />
            </form>

            {/* ---------- ARCHIVOS DE TAREA ---------- */}
            {task.attachments?.length > 0 && (
              <div className="mt-5">
                <p className="text-sm text-cyan-300 font-semibold">
                  Archivos adjuntos
                </p>

                {task.attachments.map((file) => (
                  <div
                    key={file.filename}
                    className="flex justify-between text-xs bg-[#151821] border 
                    border-white/10 px-3 py-2 rounded mt-1"
                  >
                    <a
                      href={`http://localhost:5000${file.url}`}
                      target="_blank"
                      className="text-cyan-400 underline"
                    >
                      {file.filename}
                    </a>

                    <button
                      className="text-red-400 hover:text-red-300"
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

            {/* Subir archivo a tarea */}
            <div className="mt-4">
              <FileUploader
                taskId={task._id}
                onUploaded={(task) => onTaskUpdated(normalizeTask(task))}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
