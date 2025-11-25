// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import API, {
  addSubtask,
  toggleSubtask,
  deleteSubtask,
} from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import ProgressBar from "../components/ProgressBar";
import EditTaskModal from "../components/EditTaskModal";

const Dashboard = () => {
  // -------- ESTADOS --------
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("Todas");
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);

  // Cargar tareas al inicio
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error al cargar tareas", err);
    }
  };

  // ⭐ Normalizar respuestas
  const normalizeTask = (data) => (data?.task ? data.task : data);

  // -------- CRUD de TAREAS --------

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await API.put(`/tasks/${id}`, { completed });
      handleTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error al actualizar tarea", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea", err);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id
          ? {
              ...updatedTask,
              attachments: [...(updatedTask.attachments || [])],
              subtasks: updatedTask.subtasks.map((sub) => ({
                ...sub,
                attachments: [...(sub.attachments || [])],
              })),
            }
          : task
      )
    );
  };

  const handleMakeGlobal = async (id) => {
    try {
      const res = await API.put(`/tasks/${id}/make-global`);
      handleTaskUpdated(normalizeTask(res.data));
      alert("Tarea publicada en tareas globales");
    } catch (err) {
      console.error("Error al publicar tarea global", err);
      alert("No se pudo publicar la tarea");
    }
  };

  // -------- EDITAR TAREA --------
  const handleEditTask = (task) => {
    setTaskBeingEdited(task);
  };

  const handleSaveTask = async (updatedTask) => {
    try {
      const res = await API.put(`/tasks/${updatedTask._id}`, {
        title: updatedTask.title,
        priority: updatedTask.priority,
      });

      handleTaskUpdated(normalizeTask(res.data));
      setTaskBeingEdited(null);
    } catch (err) {
      console.error("Error actualizando tarea", err);
    }
  };

  // -------- SUBTAREAS --------

  const handleAddSub = async (taskId, text) => {
    try {
      const res = await addSubtask(taskId, text);
      handleTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error agregando subtarea:", err);
    }
  };

  const handleToggleSub = async (taskId, subId, done) => {
    try {
      const res = await toggleSubtask(taskId, subId, done);
      handleTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error actualizando subtarea:", err);
    }
  };

  const handleDeleteSub = async (taskId, subId) => {
    if (!window.confirm("¿Eliminar esta subtarea?")) return;

    try {
      const res = await deleteSubtask(taskId, subId);
      handleTaskUpdated(normalizeTask(res.data));
    } catch (err) {
      console.error("Error eliminando subtarea:", err);
    }
  };

  // -------- FILTROS --------

  const filteredTasks = tasks.filter((task) => {

    // Protección total: si no existe título, usar ""
    const title = (task?.title || "").toLowerCase();

    const matchesSearch = title.includes(search.toLowerCase());

    const matchesPriority =
      filterPriority === "Todas" ||
      (task.priority && task.priority === filterPriority);

    return matchesSearch && matchesPriority;
  });


  // -------- UI --------

  return (
    <div className="min-h-screen p-8 text-gray-100 bg-[#0D0F18]">

      {/* ---------- CABECERA ---------- */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-cyan-400 tracking-wide">
          Mis tareas
        </h1>
        <p className="text-gray-500 mt-1">
          Organiza tu día con claridad y foco.
        </p>
      </div>

      {/* ---------- CONTENIDO PRINCIPAL ---------- */}
      <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-xl 
      border border-white/10 rounded-2xl p-8 shadow-xl">

        {/* Formulario */}
        <TaskForm onAdd={handleAddTask} />

        {/* Barra de progreso */}
        <div className="my-6">
          <ProgressBar tasks={tasks} />
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar tarea..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#1E2233] border border-[#2A2F43] text-gray-100 
            rounded px-3 py-2 focus:outline-none focus:border-cyan-400 
            focus:ring-2 focus:ring-cyan-500 w-full sm:w-1/2 transition"
          />

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-[#1E2233] border border-[#2A2F43] text-gray-100 
            rounded px-3 py-2 focus:outline-none focus:border-cyan-400 
            focus:ring-2 focus:ring-cyan-500 w-full sm:w-1/4 transition"
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Lista de tareas */}
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onTaskUpdated={handleTaskUpdated}
          onMakeGlobal={handleMakeGlobal}
          onEdit={handleEditTask}
          onAddSub={handleAddSub}
          onToggleSub={handleToggleSub}
          onDeleteSub={handleDeleteSub}
          normalizeTask={normalizeTask}
        />
      </div>

      {/* MODAL DE EDICIÓN */}
      {taskBeingEdited && (
        <EditTaskModal
          task={taskBeingEdited}
          onClose={() => setTaskBeingEdited(null)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
