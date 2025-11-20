import React, { useEffect, useState } from "react";
import API from "../services/api";

export default function GlobalTasks() {
  const [tasks, setTasks] = useState([]);

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tareas globales</h1>

      {tasks.length === 0 && (
        <p className="text-gray-500">No hay tareas globales aún.</p>
      )}

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="border rounded p-4 shadow bg-white"
          >
            <h3 className="font-semibold text-xl">{task.title}</h3>

            {task.userId && (
              <p className="text-xs text-gray-500 mb-2">
                Publicado por: {task.userId.name} ({task.userId.email})
              </p>
            )}

            {task.attachments?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Archivos adjuntos:</p>
                {task.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    href={`http://localhost:5000${file.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline block text-sm"
                  >
                    {file.filename}
                  </a>
                ))}
              </div>
            )}

            <p className="mt-2 text-sm">
              Prioridad: <b>{task.priority}</b>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
