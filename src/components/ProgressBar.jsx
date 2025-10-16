import React from "react";

const ProgressBar = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p>No hay tareas registradas aún.</p>;
  }

  const completed = tasks.filter(t => t.completed).length;
  const percentage = Math.round((completed / tasks.length) * 100);

  return (
    <div style={{ margin: "15px 0" }}>
      <div
        style={{
          height: "20px",
          width: "100%",
          backgroundColor: "#ddd",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: percentage === 100 ? "#4CAF50" : "#2196F3",
            transition: "width 0.3s ease-in-out",
          }}
        ></div>
      </div>
      <p style={{ textAlign: "center", marginTop: "5px" }}>
        {percentage}% completadas ({completed}/{tasks.length})
      </p>
    </div>
  );
};

export default ProgressBar;
