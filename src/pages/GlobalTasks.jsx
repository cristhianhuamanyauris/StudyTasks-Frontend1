import React, { useEffect, useState } from "react";
import API from "../services/api";
import GlobalTaskCard from "../components/GlobalTaskCard";

export default function GlobalTasks() {
  const [tasks, setTasks] = useState([]);

  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const [sortByDate, setSortByDate] = useState("none");
  const [onlyWithFiles, setOnlyWithFiles] = useState(false);
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGlobalTasks();
  }, []);

  const fetchGlobalTasks = async () => {
    try {
      const res = await API.get("/tasks/global/list");
      setTasks(res.data);
    } catch (err) {
      console.error("Error cargando tareas globales", err);
    }
  };

  // 🔎 FILTROS AVANZADOS
  const applyFilters = () => {
    let filtered = [...tasks];

    // Búsqueda
    if (search.trim()) {
      const text = search.toLowerCase();
      filtered = filtered.filter((t) => {
        const titulo = t.title?.toLowerCase() || "";
        const nombre = t.userId?.name?.toLowerCase() || "";
        const email = t.userId?.email?.toLowerCase() || "";
        return (
          titulo.includes(text) ||
          nombre.includes(text) ||
          email.includes(text)
        );
      });
    }

    // Prioridad
    if (priorityFilter !== "Todas") {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    // Con archivos
    if (onlyWithFiles) {
      filtered = filtered.filter((t) => t.attachments?.length > 0);
    }

    // Urgentes (<48 horas)
    if (onlyUrgent) {
      const now = new Date();
      const limit = 48 * 60 * 60 * 1000;
      filtered = filtered.filter((t) => {
        if (!t.dueDate) return false;
        const diff = new Date(t.dueDate) - now;
        return diff > 0 && diff <= limit;
      });
    }

    // Ordenar por fecha
    if (sortByDate === "asc") {
      filtered.sort(
        (a, b) =>
          new Date(a.dueDate || 9999) - new Date(b.dueDate || 9999)
      );
    }
    if (sortByDate === "desc") {
      filtered.sort(
        (a, b) =>
          new Date(b.dueDate || 0) - new Date(a.dueDate || 0)
      );
    }

    return filtered;
  };

  const filteredTasks = applyFilters();

  return (
    <div className="min-h-screen p-10 text-gray-200">

      {/* Título */}
      <h1 className="text-4xl font-extrabold text-center text-cyan-400 mb-10 tracking-wide">
        Tareas Globales 🌍
      </h1>

      {/* PANEL DE FILTROS */}
      <div className="glass border border-cyan-400/20 p-6 rounded-xl mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Búsqueda */}
        <div className="md:col-span-4">
          <input
            type="text"
            placeholder="Buscar por título, autor o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-cyan-500/30 text-gray-200 focus:ring-2 focus:ring-cyan-400 outline-none"
          />
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm text-gray-300 mb-1 font-semibold">
            Prioridad:
          </label>
          <select
            className="w-full p-3 bg-black/40 rounded border border-cyan-500/30 text-gray-200"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Orden */}
        <div>
          <label className="block text-sm text-gray-300 mb-1 font-semibold">
            Ordenar por fecha:
          </label>
          <select
            className="w-full p-3 bg-black/40 rounded border border-cyan-500/30 text-gray-200"
            value={sortByDate}
            onChange={(e) => setSortByDate(e.target.value)}
          >
            <option value="none">Sin ordenar</option>
            <option value="asc">Más próximas</option>
            <option value="desc">Más lejanas</option>
          </select>
        </div>

        {/* Solo con archivos */}
        <div className="flex items-center gap-2 text-gray-300 mt-6">
          <input
            type="checkbox"
            checked={onlyWithFiles}
            onChange={(e) => setOnlyWithFiles(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Solo con archivos</span>
        </div>

        {/* Urgentes */}
        <div className="flex items-center gap-2 text-gray-300 mt-6">
          <input
            type="checkbox"
            checked={onlyUrgent}
            onChange={(e) => setOnlyUrgent(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Próximas a vencer (&lt;48h)</span>
        </div>
      </div>

      {/* LISTA DE TAREAS */}
      {filteredTasks.length === 0 && (
        <p className="text-gray-400 text-center text-lg">
          No hay tareas que coincidan con los filtros.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <GlobalTaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}
