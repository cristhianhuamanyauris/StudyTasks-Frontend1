/*
import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => setToken(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return showRegister ? (
      <>
        <Register />
        <p>
          ¿Ya tienes cuenta?{" "}
          <button onClick={() => setShowRegister(false)}>Inicia sesión</button>
        </p>
      </>
    ) : (
      <>
        <Login onLogin={handleLogin} />
        <p>
          ¿No tienes cuenta?{" "}
          <button onClick={() => setShowRegister(true)}>Regístrate</button>
        </p>
      </>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
*/
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

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

  return (
    <Routes>
      {/* Ruta pública: Login */}
      <Route path="/" element={<Login onLogin={handleLogin} />} />

      {/* Ruta pública: Registro */}
      <Route
        path="/register"
        element={<Register onRegisterSuccess={() => navigate("/")} />}
      />

      {/* Ruta protegida: Dashboard */}
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
    </Routes>
  );
}

export default App;
