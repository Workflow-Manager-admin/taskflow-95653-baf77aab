import React, { useContext, useEffect } from "react";
import { TaskContext } from "./TaskContext";

// PUBLIC_INTERFACE
export default function TaskList({ onSelect, onCreate }) {
  const { tasks, loading, error, reloadTasks, selectedTask, selectTask } =
    useContext(TaskContext);

  useEffect(() => {
    reloadTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ flex: 1, margin: 0 }}>Your Tasks</h2>
        <button className="btn" onClick={reloadTasks} style={{ marginRight: 7 }}>
          Refresh
        </button>
        <button className="btn" onClick={onCreate}>
          + New Task
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && tasks.length === 0 && (
        <div style={{ padding: 20 }}>No tasks found. Create one!</div>
      )}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li
            key={task.id}
            className={selectedTask && task.id === selectedTask.id ? "selected" : ""}
            style={{
              background:
                selectedTask && task.id === selectedTask.id
                  ? "var(--bg-secondary)"
                  : "#fff",
              marginBottom: 10,
              borderRadius: 8,
              boxShadow: "0 1px 4px rgba(0,0,0,.06)",
              padding: 14,
              cursor: "pointer",
              border: "1px solid var(--border-color)"
            }}
            onClick={() => {
              selectTask(task.id);
              if (onSelect) onSelect(task.id);
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600 }}>
              {task.title}{" "}
              {task.completed ? (
                <span style={{ color: "#4BB543", fontWeight: "normal" }}>
                  (Done)
                </span>
              ) : null}
            </div>
            <div style={{ fontSize: 13, color: "#777", marginTop: 2 }}>
              Due:{" "}
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
              &nbsp;&middot;&nbsp;Priority: {task.priority || "-"}
              &nbsp;&middot;&nbsp;Status: {task.status || (task.completed ? "Done" : "Pending")}
            </div>
            {task.description && (
              <div style={{ fontSize: 13, color: "#333", marginTop: 5 }}>
                {task.description.length > 48
                  ? task.description.slice(0, 48) + "…"
                  : task.description}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
