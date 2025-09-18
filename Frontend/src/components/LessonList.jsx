import React from "react";

export default function LessonList({ items, activeId, onSelect, progress }) {
  return (
    <nav className="lesson-list">
      {items.map((l) => {
        const active = l.id === activeId;
        const done = progress[l.exerciseId];
        return (
          <button
            key={l.id}
            className={`lesson ${active ? "active" : ""}`}
            onClick={() => onSelect(l.id)}
          >
            <span>{l.title}</span>
            {done ? <span className="check">✓</span> : null}
          </button>
        );
      })}
    </nav>
  );
}
