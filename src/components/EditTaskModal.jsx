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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center px-4 z-50">
      
      {/* MODAL */}
      <div className="bg-white/10 backdrop-blur-2xl border border-cyan-400/20 
      rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">
          Editar tarea
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            value={title}
            placeholder="Título de la tarea"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#1E2233] text-gray-100 px-4 py-2 rounded-lg 
            border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
            focus:ring-cyan-500 transition"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full bg-[#1E2233] text-gray-100 px-4 py-2 rounded-lg 
            border border-[#2A2F43] focus:border-cyan-400 focus:ring-2 
            focus:ring-cyan-500 transition"
          >
            <option value="Alta">🔥 Alta</option>
            <option value="Media">⚡ Media</option>
            <option value="Baja">🌱 Baja</option>
          </select>

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600/30 border border-gray-500/30 
              text-gray-300 hover:bg-gray-600/50 transition active:scale-95"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 
              text-white font-semibold shadow-lg hover:opacity-90 active:scale-95 transition"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
