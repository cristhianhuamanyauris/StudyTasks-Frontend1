import React, { useState } from "react";
import API from "../services/api";

const TaskForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Media");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await API.post("/tasks", {
        title,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      });

      // ⭐ NORMALIZAMOS RESPUESTA PARA EVITAR PROBLEMAS
      const normalized = res.data?.task ? res.data.task : res.data;

      onAdd(normalized);

      // limpiar formulario
      setTitle("");
      setDueDate("");
      setPriority("Media");
    } catch (err) {
      console.error("Error al crear la tarea", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-lg transition"
    >
      {/* Input título */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="➕ Añadir nueva tarea..."
        className="flex-1 bg-[#1E2233] border border-[#2A2F43] text-gray-100 px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition w-full"
      />

      {/* Fecha */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="bg-[#1E2233] border border-[#2A2F43] text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition"
      />

      {/* Prioridad */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="bg-[#1E2233] border border-[#2A2F43] text-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500 transition"
      >
        <option value="Alta">🔥 Alta</option>
        <option value="Media">⚡ Media</option>
        <option value="Baja">🌱 Baja</option>
      </select>

      {/* Botón */}
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold px-5 py-2 rounded-lg shadow-lg hover:opacity-90 active:scale-95 transition"
      >
        Agregar
      </button>
    </form>
  );
};

export default TaskForm;
