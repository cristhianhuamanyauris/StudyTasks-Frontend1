import React from "react";

export default function ProgressBar({ tasks }) {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm">
        No hay tareas registradas aún.
      </p>
    );
  }

  const completed = tasks.filter((t) => t.completed).length;
  const percentage = Math.round((completed / tasks.length) * 100);

  return (
    <div className="w-full mt-4 p-4 glass rounded-xl border border-cyan-400/20 shadow-md">
      
      {/* Barra */}
      <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage === 100 ? "bg-green-400" : "bg-cyan-400"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Texto */}
      <p className="mt-2 text-center text-cyan-200 text-sm tracking-wide">
        {percentage}% completadas ({completed}/{tasks.length})
      </p>
    </div>
  );
}
