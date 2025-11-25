// src/pages/DocumentEditor.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";

import { io } from "socket.io-client";
import * as Y from "yjs";
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from "y-prosemirror";
import { Awareness } from "y-protocols/awareness";
import * as awarenessProtocol from "y-protocols/awareness";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { deleteDocument } from "../utils/documentApi";

const SOCKET_URL = "http://localhost:5000";

export default function DocumentEditor({ documentId }) {
  const [title, setTitle] = useState("");
  const [docData, setDocData] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [joinError, setJoinError] = useState("");

  // 🧠 Yjs Documento sincronizado
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yXmlFragment = useMemo(() => ydoc.getXmlFragment("prosemirror"), [ydoc]);

  const awareness = useMemo(() => new Awareness(ydoc), [ydoc]);

  const localUser = useMemo(() => {
    const colors = ["#ff0000", "#00aa00", "#0000ff", "#ff00aa", "#ffaa00"];
    return { name: "Usuario", color: colors[Math.floor(Math.random() * colors.length)] };
  }, []);

  const socketRef = useRef(null);

  // 📝 Editor TipTap
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
      Underline,
      TextStyle,
      Color,
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize.configure({ types: ["textStyle"] }),
      TextAlign.configure({ types: ["paragraph", "heading"] }),
    ],
    content: "",
    onCreate: ({ editor }) => {
      editor.registerPlugin(ySyncPlugin(yXmlFragment));
      editor.registerPlugin(yCursorPlugin(awareness));
      editor.registerPlugin(yUndoPlugin());
    },
  });

  // 1️⃣ Socket
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
      });

      socketRef.current.on("join-error", (msg) =>
        setJoinError(msg || "No tienes acceso a este documento")
      );
    }
  }, []);

  // 2️⃣ Cargar metadata
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`${SOCKET_URL}/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTitle(data.title);
      setDocData(data);
    };
    load();
  }, [documentId]);

  // 3️⃣ Awareness local
  useEffect(() => {
    awareness.setLocalState({ user: localUser, cursor: null });
    return () => awareness.setLocalState(null);
  }, []);

  // 4️⃣ Sincronización Yjs ↔ Socket
  useEffect(() => {
    if (!socketRef.current || !editor) return;

    const socket = socketRef.current;
    const token = localStorage.getItem("token");

    socket.emit("join-document", { documentId, token });

    const applyRemote = (update) =>
      Y.applyUpdate(ydoc, Uint8Array.from(update), "socket");

    socket.on("document-state", applyRemote);
    socket.on("sync-update", applyRemote);

    socket.on("awareness-update", (update) =>
      awarenessProtocol.applyAwarenessUpdate(
        awareness,
        Uint8Array.from(update),
        "socket"
      )
    );

    ydoc.on("update", (u, origin) => {
      if (origin !== "socket")
        socket.emit("sync-update", Array.from(u));
    });

    awareness.on("update", ({ added, updated, removed }, origin) => {
      if (origin === "socket") return;
      const clients = [...added, ...updated, ...removed];
      const packet = awarenessProtocol.encodeAwarenessUpdate(awareness, clients);
      socket.emit("awareness-update", Array.from(packet));
    });
  }, [editor]);

  // Guardar documento
  const saveDocument = async () => {
    const token = localStorage.getItem("token");

    await fetch(`${SOCKET_URL}/api/documents/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    socketRef.current.emit("save-document");
    alert("Documento guardado");
  };

  // ➕ Invitar
  const inviteCollaborator = async () => {
    if (!inviteEmail) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${SOCKET_URL}/api/documents/${documentId}/collaborators`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    setDocData(data);
    setInviteEmail("");
  };

  // Exportaciones
  const exportAsText = () => {
    const blob = new Blob([editor.getText()], { type: "text/plain" });
    const link = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = `${title}.txt`;
    a.click();
  };

  const exportAsHTML = () => {
    const blob = new Blob([editor.getHTML()], { type: "text/html" });
    const link = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = link;
    a.download = `${title}.html`;
    a.click();
  };

  const exportAsPDF = async () => {
    const el = document.querySelector(".tiptap");
    const canvas = await html2canvas(el);
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(img, "PNG", 0, 0, 210, 0);
    pdf.save(`${title}.pdf`);
  };

  // 🌟 Toolbar (Tailwind)
  const Toolbar = () => (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-100 border rounded">

      {/* Bold / Italic / Underline */}
      <button
        className="px-2 py-1 border rounded hover:bg-gray-200 font-bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </button>

      <button
        className="px-2 py-1 border rounded hover:bg-gray-200 italic font-bold"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </button>

      <button
        className="px-2 py-1 border rounded hover:bg-gray-200 underline font-bold"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </button>

      {/* Color */}
      <input
        type="color"
        className="w-10 h-10 border rounded"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />

      {/* Tamaño */}
      <select
        className="border rounded px-2 py-1"
        onChange={(e) =>
          editor.chain().focus().setFontSize(e.target.value).run()
        }
      >
        {[12, 14, 16, 20, 24, 30, 36].map((s) => (
          <option key={s} value={`${s}px`}>
            {s}
          </option>
        ))}
      </select>

      {/* Fuente */}
      <select
        className="border rounded px-2 py-1"
        onChange={(e) =>
          editor.chain().focus().setFontFamily(e.target.value).run()
        }
      >
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
      </select>

      {/* Alineación */}
      <button
        className="px-2 py-1 border rounded hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ⬅️
      </button>

      <button
        className="px-2 py-1 border rounded hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ☰
      </button>

      <button
        className="px-2 py-1 border rounded hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ➡️
      </button>

      <button
        className="px-2 py-1 border rounded hover:bg-gray-200"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        📐
      </button>
    </div>
  );

  if (!editor) return <p className="p-8">Cargando editor...</p>;

  if (joinError)
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-bold">No puedes abrir este documento</h2>
        <p>{joinError}</p>
      </div>
    );

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-4">

      {/* Título */}
      <input
        className="border p-2 rounded w-full text-xl font-semibold"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Toolbar */}
      <Toolbar />

      {/* Acciones */}
      <div className="flex flex-wrap gap-2">

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={saveDocument}
        >
          Guardar
        </button>

        <button className="px-3 py-2 bg-gray-700 text-white rounded" onClick={exportAsText}>
          TXT
        </button>

        <button className="px-3 py-2 bg-purple-700 text-white rounded" onClick={exportAsHTML}>
          HTML
        </button>

        <button className="px-3 py-2 bg-red-700 text-white rounded" onClick={exportAsPDF}>
          PDF
        </button>

        {/* Invitación */}
        <input
          type="email"
          className="border p-2 rounded"
          placeholder="Email colaborador"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />

        <button
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={inviteCollaborator}
        >
          Invitar
        </button>

        {/* Eliminar */}
        <button
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={async () => {
            if (!window.confirm("¿Eliminar documento?")) return;
            await deleteDocument(documentId);
            window.location.href = "/dashboard";
          }}
        >
          Eliminar
        </button>
      </div>

      {/* Info */}
      {docData && (
        <div className="p-3 bg-gray-50 border rounded">
          <p><b>Propietario:</b> {docData.owner?.name}</p>
          <p><b>Colaboradores:</b></p>
          <ul className="list-disc ml-5">
            {docData.collaborators.map((c) => (
              <li key={c._id}>
                {c.name} ({c.email})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="tiptap border p-4 bg-white rounded min-h-[500px]"
      />
    </div>
  );
}
