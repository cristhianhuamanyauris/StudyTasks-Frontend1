import React, { useEffect, useState } from "react";
import API from "../services/api";
import GlobalTaskCard from "../components/GlobalTaskCard";

export default function GlobalTasks() {
  const [tasks, setTasks] = useState([]);

  // Filtros
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

  // ===========================
  // FILTROS AVANZADOS
  // ===========================
  const applyFilters = () => {
    let filtered = [...tasks];

    // 🔍 Buscar por título, autor o email
    if (search.trim() !== "") {
      const text = search.toLowerCase();

      filtered = filtered.filter((t) => {
        const title = t.title?.toLowerCase() || "";
        const name = t.userId?.name?.toLowerCase() || "";
        const email = t.userId?.email?.toLowerCase() || "";

        return (
          title.includes(text) ||
          name.includes(text) ||
          email.includes(text)
        );
      });
    }

    // Filtrar por prioridad
    if (priorityFilter !== "Todas") {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }

    // Solo tareas con archivos
    if (onlyWithFiles) {
      filtered = filtered.filter((t) => t.attachments?.length > 0);
    }

    // Solo próximas a vencer (<48h)
    if (onlyUrgent) {
      const now = new Date();
      const limit = 48 * 60 * 60 * 1000; // 48h

      filtered = filtered.filter((t) => {
        if (!t.dueDate) return false;
        const diff = new Date(t.dueDate) - now;
        return diff > 0 && diff <= limit;
      });
    }

    // Orden por fecha
    if (sortByDate === "asc") {
      filtered.sort((a, b) =>
        new Date(a.dueDate || 9999) - new Date(b.dueDate || 9999)
      );
    }
    if (sortByDate === "desc") {
      filtered.sort((a, b) =>
        new Date(b.dueDate || 0) - new Date(a.dueDate || 0)
      );
    }

    return filtered;
  };

  const filteredTasks = applyFilters();

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold mb-6 text-center">
        Tareas globales 🌍
      </h1>

      {/* ============================================
         🔍 PANEL DE FILTROS
      ==============================================*/}
      <div className="bg-white shadow p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Barra de búsqueda */}
        <div className="md:col-span-4">
          <input
            type="text"
            placeholder="Buscar por título o autor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Filtro por prioridad */}
        <div>
          <label className="font-semibold text-sm">Prioridad:</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Ordenar por fecha */}
        <div>
          <label className="font-semibold text-sm">Ordenar por fecha:</label>
          <select
            className="w-full border p-2 rounded mt-1"
            value={sortByDate}
            onChange={(e) => setSortByDate(e.target.value)}
          >
            <option value="none">Sin ordenar</option>
            <option value="asc">Más próximas</option>
            <option value="desc">Más lejanas</option>
          </select>
        </div>

        {/* Solo con archivos */}
        <div className="flex items-center mt-6 gap-2">
          <input
            type="checkbox"
            checked={onlyWithFiles}
            onChange={(e) => setOnlyWithFiles(e.target.checked)}
          />
          <span className="text-sm">Solo con archivos</span>
        </div>

        {/* Próximas a vencer */}
        <div className="flex items-center mt-6 gap-2">
          <input
            type="checkbox"
            checked={onlyUrgent}
            onChange={(e) => setOnlyUrgent(e.target.checked)}
          />
          <span className="text-sm">Próximas a vencer (&lt;48h)</span>
        </div>

      </div>

      {/* ============================================
         🟦 LISTA DE TAREAS
      ==============================================*/}

      {filteredTasks.length === 0 && (
        <p className="text-gray-500 text-center">
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
