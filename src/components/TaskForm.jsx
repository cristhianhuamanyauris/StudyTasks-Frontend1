
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

      onAdd(res.data);
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
        className="flex flex-col sm:flex-row items-center gap-3 mb-4"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Añadir nueva tarea..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition"
        >
          Agregar
        </button>
      </form>

  );
};

export default TaskForm;
