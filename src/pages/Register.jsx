import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register({ onRegisterSuccess }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
    phone: "",
    profession: "",
    country: "",
    city: "",
    bio: "",
  });

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // 🔄 Manejar estados
  // ==========================================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================================
  // 📩 Enviar formulario
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      setMsg("✅ Registro exitoso. Ahora puedes iniciar sesión.");
      setError("");

      onRegisterSuccess && onRegisterSuccess();
    } catch (err) {
      console.error(err);
      setError("❌ Error al registrarte.");
      setMsg("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Crear cuenta
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Nombre */}
          <div className="flex gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={form.firstName}
              onChange={handleChange}
              className="w-1/2 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={form.lastName}
              onChange={handleChange}
              className="w-1/2 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Contraseña */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Fecha de nacimiento */}
          <div>
            <label className="text-sm text-gray-600">Fecha de nacimiento</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Teléfono */}
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={form.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          {/* País / ciudad */}
          <div className="flex gap-4">
            <input
              type="text"
              name="country"
              placeholder="País"
              value={form.country}
              onChange={handleChange}
              className="w-1/2 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={form.city}
              onChange={handleChange}
              className="w-1/2 border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Profesión */}
          <input
            type="text"
            name="profession"
            placeholder="Profesión"
            value={form.profession}
            onChange={handleChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
          />

          {/* Biografía */}
          <textarea
            name="bio"
            placeholder="Biografía (opcional)"
            value={form.bio}
            onChange={handleChange}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400 h-24 resize-none"
          />

          {/* Botón */}
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Registrarse
          </button>
        </form>

        {msg && <p className="text-green-600 mt-4 text-center">{msg}</p>}
        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

        {/* Enlace a login */}
        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline font-semibold"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
