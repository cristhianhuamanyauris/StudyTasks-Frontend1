// src/pages/DocumentEditor.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { io } from "socket.io-client";
import * as Y from "yjs";
import { ySyncPlugin, yCursorPlugin, yUndoPlugin } from "y-prosemirror";
import { Awareness } from "y-protocols/awareness";
import * as awarenessProtocol from "y-protocols/awareness";

const SOCKET_URL = "http://localhost:5000";

export default function DocumentEditor({ documentId }) {
  const [title, setTitle] = useState("");

  // 🧠 Documento Yjs en memoria (instancia única)
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yXmlFragment = useMemo(() => ydoc.getXmlFragment("prosemirror"), [ydoc]);

  // 🧍 Awareness
  const awareness = useMemo(() => new Awareness(ydoc), [ydoc]);

  // 🎨 Usuario local
  const localUser = useMemo(() => {
    const colors = ["#ff0000", "#00aa00", "#0000ff", "#ff00aa", "#ffaa00"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return { name: "Usuario", color };
  }, []);

  // 🔌 Socket estable
  const socketRef = useRef(null);

  // 📝 TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ history: false }),
    ],
    content: "",
    onCreate: ({ editor }) => {
      editor.registerPlugin(ySyncPlugin(yXmlFragment));
      editor.registerPlugin(yCursorPlugin(awareness));
      editor.registerPlugin(yUndoPlugin());
    },
  });

  // 1️⃣ Conectar socket una sola vez
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
      });

      socketRef.current.on("connect", () => {
        console.log("🟢 Socket conectado:", socketRef.current.id);
      });

      socketRef.current.on("disconnect", () => {
        console.log("🔴 Socket desconectado");
      });
    }

    const socket = socketRef.current;

    // NO lo desconectamos — Socket estable para toda la app
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // 2️⃣ Cargar metadata (solo título)
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${SOCKET_URL}/api/documents/${documentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setTitle(data.title || "");
      } catch (err) {
        console.error("Error cargando documento:", err);
      }
    };

    if (documentId) loadMetadata();
  }, [documentId]);

  // 3️⃣ Configurar awareness local
  useEffect(() => {
    awareness.setLocalState({
      user: localUser,
      cursor: null,
    });

    return () => awareness.setLocalState(null);
  }, [awareness, localUser]);

  // 4️⃣ Conectar Yjs ↔ Socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !documentId) return;

    console.log("📡 Joining document:", documentId);

    // Unirse a sala
    socket.emit("join-document", { documentId });

    // Estado inicial
    const handleDocumentState = (updateArray) => {
      try {
        Y.applyUpdate(ydoc, Uint8Array.from(updateArray), "socket");
      } catch (err) {
        console.error("Error aplicando snapshot:", err);
      }
    };

    // Actualizaciones remotas
    const handleSyncUpdate = (updateArray) => {
      try {
        Y.applyUpdate(ydoc, Uint8Array.from(updateArray), "socket");
      } catch (err) {
        console.error("Error aplicando update remoto:", err);
      }
    };

    // Awareness remoto
    const handleAwarenessUpdate = (updateArray) => {
      try {
        awarenessProtocol.applyAwarenessUpdate(
          awareness,
          Uint8Array.from(updateArray),
          "socket"
        );
      } catch (err) {
        console.error("Error awareness remoto:", err);
      }
    };

    socket.on("document-state", handleDocumentState);
    socket.on("sync-update", handleSyncUpdate);
    socket.on("awareness-update", handleAwarenessUpdate);

    // Actualizaciones locales Yjs → socket
    const handleLocalYUpdate = (update, origin) => {
      if (origin === "socket") return;
      socket.emit("sync-update", Array.from(update));
    };

    ydoc.on("update", handleLocalYUpdate);

    // Awareness local → socket
    const handleLocalAwareness = ({ added, updated, removed }, origin) => {
      if (origin === "socket") return;
      const clients = [...added, ...updated, ...removed];
      const update = awarenessProtocol.encodeAwarenessUpdate(awareness, clients);
      socket.emit("awareness-update", Array.from(update));
    };

    awareness.on("update", handleLocalAwareness);

    return () => {
      socket.off("document-state", handleDocumentState);
      socket.off("sync-update", handleSyncUpdate);
      socket.off("awareness-update", handleAwarenessUpdate);
      ydoc.off("update", handleLocalYUpdate);
      awareness.off("update", handleLocalAwareness);
    };
  }, [documentId, ydoc, awareness]);

  // 5️⃣ Guardar documento
  const saveDocument = async () => {
    try {
      const token = localStorage.getItem("token");

      // Guardar título
      await fetch(`${SOCKET_URL}/api/documents/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      // Snapshot Yjs en servidor
      socketRef.current.emit("save-document");

      alert("Documento guardado");
    } catch (err) {
      console.error("Error guardando:", err);
    }
  };

  if (!editor) return <div className="p-8">Cargando editor...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <input
        className="border p-2 rounded w-full mb-4 text-xl font-semibold"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título del documento"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={saveDocument}
      >
        Guardar
      </button>

      <EditorContent
        editor={editor}
        className="border p-4 bg-white rounded min-h-[400px]"
      />
    </div>
  );
}
