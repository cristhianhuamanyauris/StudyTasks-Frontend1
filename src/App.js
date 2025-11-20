/*
// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DocumentEditor from "./pages/DocumentEditor";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  // Wrapper para usar useParams()
  function DocumentEditorWrapper() {
    const { id } = useParams();
    return <DocumentEditor documentId={id} />;
  }

  return (
    <Routes>
      {/* Login /}
      <Route path="/" element={<Login onLogin={handleLogin} />} />

      {/* Registro /}
      <Route
        path="/register"
        element={<Register onRegisterSuccess={() => navigate("/")} />}
      />

      {/* Dashboard /}
      <Route
        path="/dashboard"
        element={
          token ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Editor de documentos (Ruta Protegida) /}
      <Route
        path="/documents/:id"
        element={
          token ? (
            <DocumentEditorWrapper />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
*/


// src/App.js
import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DocumentEditor from "./pages/DocumentEditor";
import GlobalTasks from "./pages/GlobalTasks";
import SidebarLayout from "./layouts/SidebarLayout";

import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  // ---- LOGIN ----
  const handleLogin = () => {
    setToken(localStorage.getItem("token"));
    navigate("/dashboard");
  };

  // ---- LOGOUT ----
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  // Para leer params en el editor
  function DocumentEditorWrapper() {
    const { id } = useParams();
    return <DocumentEditor documentId={id} />;
  }

  return (
    <Routes>
      {/* ---------------- LOGIN ---------------- */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />

      {/* ---------------- REGISTRO ---------------- */}
      <Route
        path="/register"
        element={<Register onRegisterSuccess={() => navigate("/")} />}
      />

      {/* ---------------- DASHBOARD ---------------- */}
      <Route
        path="/dashboard"
        element={
          token ? (
            <SidebarLayout>
              <Dashboard onLogout={handleLogout} />
            </SidebarLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ---------------- TAREAS GLOBALES ---------------- */}
      <Route
        path="/global"
        element={
          token ? (
            <SidebarLayout>
              <GlobalTasks />
            </SidebarLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ---------------- DOCUMENT EDITOR ---------------- */}
      <Route
        path="/documents/:id"
        element={
          token ? (
            <SidebarLayout>
              <DocumentEditorWrapper />
            </SidebarLayout>
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
