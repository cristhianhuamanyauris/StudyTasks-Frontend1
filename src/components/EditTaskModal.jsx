import React, { useState, useEffect } from "react";

export default function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...task,
      title,
      priority,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Editar tarea</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            placeholder="Título"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
