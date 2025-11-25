import React, { useEffect, useState } from "react";
import API, { addSubtask, deleteSubtask, toggleSubtask } from "../services/api";
import KanbanTaskCard from "../components/KanbanTaskCard";

export default function TaskKanban() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  // Handlers del dashboard (editar, eliminar, publicar)
  const handleDelete = async (id) => {
    await API.delete(`/tasks/${id}`);
    loadTasks();
  };

  const handleMakeGlobal = async (id) => {
    const res = await API.put(`/tasks/${id}/make-global`);
    loadTasks();
  };

  const handleEdit = (task) => {
    alert("La edición completa la hacemos en el dashboard. Próximamente modal Kanban.");
  };

  // MATH TIEMPO
  const now = new Date();
  const diffHours = (date) => (new Date(date) - now) / (1000 * 60 * 60);

  const onTime = tasks.filter((t) => {
    if (!t.dueDate) return true;
    return diffHours(t.dueDate) >= 24;
  });

  const urgent = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const d = diffHours(t.dueDate);
    return d < 24 && d >= 0;
  });

  const expired = tasks.filter((t) => {
    if (!t.dueDate) return false;
    return diffHours(t.dueDate) < 0;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold text-center mb-8">
        Panel de Prioridad por Tiempo ⏳
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* EN TIEMPO */}
        <div className="bg-white rounded-lg shadow p-4 border-t-4 border-green-500">
          <h2 className="text-lg font-semibold text-green-600 mb-4">En tiempo</h2>

          {onTime.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin tareas</p>
          ) : (
            onTime.map(task => (
              <KanbanTaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMakeGlobal={handleMakeGlobal}
              />
            ))
          )}
        </div>


        {/* URGENTES */}
        <div className="bg-white rounded-lg shadow p-4 border-t-4 border-orange-500">
          <h2 className="text-lg font-semibold text-orange-600 mb-4">
            {"Urgentes (<24h)"}
          </h2>

          {urgent.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin tareas urgentes</p>
          ) : (
            urgent.map(task => (
              <KanbanTaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMakeGlobal={handleMakeGlobal}
              />
            ))
          )}
        </div>

        {/* VENCIDAS */}
        <div className="bg-white rounded-lg shadow p-4 border-t-4 border-red-500">
          <h2 className="text-lg font-semibold text-red-600 mb-4">Vencidas</h2>

          {expired.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay vencidas</p>
          ) : (
            expired.map(task => (
              <KanbanTaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMakeGlobal={handleMakeGlobal}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
