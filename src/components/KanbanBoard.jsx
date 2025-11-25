import React from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable";

import SortableTaskCard from "./SortableTaskCard";

export default function KanbanBoard({ tasks, onStatusChange }) {
  const sensors = useSensors(useSensor(PointerSensor));

  const columns = {
    pending: {
      title: "Pendientes",
      tasks: tasks.filter(t => t.status === "pending"),
    },
    "in-progress": {
      title: "En progreso",
      tasks: tasks.filter(t => t.status === "in-progress"),
    },
    completed: {
      title: "Completadas",
      tasks: tasks.filter(t => t.status === "completed"),
    },
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const newStatus = overId;
    onStatusChange(activeId, newStatus);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {Object.entries(columns).map(([status, col]) => (
          <div key={status} className="bg-gray-100 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">{col.title}</h2>

            <SortableContext
              id={status}
              items={col.tasks.map(t => t._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {col.tasks.map(task => (
                  <SortableTaskCard key={task._id} task={task} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}

      </div>
    </DndContext>
  );
}
