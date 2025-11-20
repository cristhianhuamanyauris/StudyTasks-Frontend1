import React, { useEffect, useState } from "react";
import {
  getMyProfile,
  updateProfile,
  updateAvatar,
} from "../services/profileApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      console.error("Error cargando perfil:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await updateProfile(form);
      setProfile(res.data);
      setEditing(false);
      alert("Perfil actualizado");
    } catch (err) {
      console.error("Error actualizando perfil:", err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));

    try {
      const res = await updateAvatar(file);
      setProfile(res.data);
      alert("Avatar actualizado");
    } catch (err) {
      console.error("Error subiendo avatar:", err);
    }
  };

  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-600">
        Cargando perfil...
      </div>
    );
  }

  // ============================
  // 🖼️ Avatar seguro (sin errores)
  // ============================
  const avatarUrl = avatarPreview
    ? avatarPreview
    : profile.avatar
    ? `http://localhost:5000${profile.avatar}`
    : `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=120&background=1E40AF&color=fff`;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-28 h-28 rounded-full object-cover border shadow"
        />
        <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">
          Cambiar avatar
          <input type="file" hidden onChange={handleAvatarUpload} />
        </label>
      </div>

      {/* Datos */}
      <div className="space-y-3">
        {editing ? (
          <>
            <input
              className="border p-2 rounded w-full"
              placeholder="Nombre"
              value={form.firstName || ""}
              onChange={(e) =>
                setForm({ ...form, firstName: e.target.value })
              }
            />

            <input
              className="border p-2 rounded w-full"
              placeholder="Apellido"
              value={form.lastName || ""}
              onChange={(e) =>
                setForm({ ...form, lastName: e.target.value })
              }
            />

            <input
              className="border p-2 rounded w-full"
              placeholder="Profesión"
              value={form.profession || ""}
              onChange={(e) =>
                setForm({ ...form, profession: e.target.value })
              }
            />

            <input
              className="border p-2 rounded w-full"
              placeholder="País"
              value={form.country || ""}
              onChange={(e) =>
                setForm({ ...form, country: e.target.value })
              }
            />

            <textarea
              className="border p-2 rounded w-full"
              placeholder="Biografía"
              value={form.bio || ""}
              onChange={(e) =>
                setForm({ ...form, bio: e.target.value })
              }
            ></textarea>

            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded mt-3 hover:bg-green-700 transition"
            >
              Guardar cambios
            </button>
          </>
        ) : (
          <>
            <p>
              <b>Nombre:</b> {profile.firstName} {profile.lastName}
            </p>
            <p>
              <b>Email:</b> {profile.email}
            </p>
            <p>
              <b>Profesión:</b> {profile.profession || "—"}
            </p>
            <p>
              <b>País:</b> {profile.country || "—"}
            </p>
            <p>
              <b>Bio:</b> {profile.bio || "—"}
            </p>

            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700 transition"
            >
              Editar perfil
            </button>
          </>
        )}
      </div>

      <p className="text-gray-500 text-sm mt-6">
        Miembro desde: {new Date(profile.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
