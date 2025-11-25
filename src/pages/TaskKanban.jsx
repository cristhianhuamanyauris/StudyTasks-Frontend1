import React, { useEffect, useState } from "react";
import API from "../services/api";
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

  const handleDelete = async (id) => {
    await API.delete(`/tasks/${id}`);
    loadTasks();
  };

  const handleMakeGlobal = async (id) => {
    await API.put(`/tasks/${id}/make-global`);
    loadTasks();
  };

  const handleEdit = () => {
    alert("La edición completa está en Dashboard. Próximamente editor Kanban 👀");
  };

  const now = new Date();
  const diffHours = (date) => (new Date(date) - now) / (1000 * 60 * 60);

  const onTime = tasks.filter((t) => !t.dueDate || diffHours(t.dueDate) >= 24);
  const urgent = tasks.filter((t) => t.dueDate && diffHours(t.dueDate) < 24 && diffHours(t.dueDate) >= 0);
  const expired = tasks.filter((t) => t.dueDate && diffHours(t.dueDate) < 0);

  return (
    <div className="min-h-screen p-10 text-gray-200">

      {/* HEADER */}
      <h1 className="text-4xl text-center font-extrabold text-cyan-400 mb-10 tracking-wide">
        Panel de Prioridad por Tiempo ⏳
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* EN TIEMPO */}
        <div className="glass block-cloud-col border-l-4 border-green-400">
          <h2 className="text-xl font-bold text-green-300 mb-4 tracking-wide">
            🟢 En tiempo
          </h2>

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
        <div className="glass block-cloud-col border-l-4 border-orange-400">
          <h2 className="text-xl font-bold text-orange-300 mb-4 tracking-wide">
            🟠 Urgentes (&lt;24h)
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
        <div className="glass block-cloud-col border-l-4 border-red-400">
          <h2 className="text-xl font-bold text-red-300 mb-4 tracking-wide">
            🔴 Vencidas
          </h2>

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
