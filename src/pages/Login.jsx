import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 🔄 Manejar cambios en inputs
  // ==========================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================================
  // 📩 Enviar login
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      // Guardar access token
      localStorage.setItem("token", res.data.token);

      // (Opcional) Guardar información del usuario
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setLoading(false);
      onLogin(); // notifica al App.js
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Credenciales inválidas. Intenta nuevamente.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 p-6">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Bienvenido
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className={`bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition mt-2 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
        )}

        <p className="mt-6 text-center text-gray-600">
          ¿No tienes cuenta?
          <button
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline font-semibold ml-1"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
