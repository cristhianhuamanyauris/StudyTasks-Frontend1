import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-3 rounded shadow border"
    >
      <p className="font-semibold">{task.title}</p>

      {task.dueDate && (
        <p className="text-xs text-gray-500">
          Vence: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <span className="text-xs bg-blue-200 px-2 py-1 rounded">
        {task.priority}
      </span>
    </div>
  );
}
