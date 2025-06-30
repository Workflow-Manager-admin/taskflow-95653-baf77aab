import React, { useContext } from "react";
import { TaskContext } from "./TaskContext";

// PUBLIC_INTERFACE
export default function TaskDetail({ taskId, onEdit, onClose }) {
  const { tasks, deleteTask, loading, error, selectedTask } =
    useContext(TaskContext);

  const task =
    (taskId
      ? tasks.find(t => t.id === taskId)
      : selectedTask) || null;

  if (!task) return <div style={{ padding: 30 }}>Select a task to see details.</div>;

  const handleDelete = async () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      await deleteTask(task.id);
      if (onClose) onClose();
    }
  };

  return (
    <div style={{
      background: "var(--bg-secondary)",
      borderRadius: 12,
      padding: 24,
      boxShadow: "0 2px 8px 0 rgba(40,44,52,0.07)"
    }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{ flex: 1, marginTop: 0 }}>{task.title}</h2>
        <button className="btn" style={{ marginLeft: 10 }} onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          className="btn"
          style={{ marginLeft: 10, background: "#E14A4A" }}
          onClick={handleDelete}
        >
          Delete
        </button>
        {onClose && (
          <button
            className="btn"
            style={{ marginLeft: 10, background: "#aaa" }}
            onClick={onClose}
          >Close</button>
        )}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="error">{error}</div>}
      <div style={{ marginTop: 12, marginBottom: 4 }}>
        <b>Status:</b> {task.completed ? "Done" : task.status || "Pending"}
        &nbsp;|&nbsp;<b>Priority:</b> {task.priority || "-"}
        &nbsp;|&nbsp;<b>Due Date:</b>{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleString() : "-"}
      </div>
      {task.description && (
        <div style={{ marginTop: 10 }}>
          <b>Description:</b>
          <div style={{ whiteSpace: "pre-wrap", marginTop: 4 }}>{task.description}</div>
        </div>
      )}
    </div>
  );
}
