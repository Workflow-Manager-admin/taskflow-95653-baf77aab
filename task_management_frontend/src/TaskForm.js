import React, { useContext, useState, useEffect } from "react";
import { TaskContext } from "./TaskContext";

// PUBLIC_INTERFACE
export default function TaskForm({ initial, onSubmit, onCancel }) {
  const isEdit = !!initial;
  const { createTask, updateTask, loading, error } = useContext(TaskContext);

  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [dueDate, setDueDate] = useState(
    initial?.dueDate ? initial.dueDate.slice(0, 16) : ""
  );
  const [priority, setPriority] = useState(initial?.priority || "Medium");
  const [status, setStatus] = useState(initial?.status || "Pending");
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (!loading) setFormError(null);
  }, [loading]);

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    const data = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority,
      status,
    };
    let result;
    if (isEdit) {
      result = await updateTask(initial.id, data);
    } else {
      result = await createTask(data);
    }
    if (result.success && onSubmit) {
      onSubmit();
    } else if (!result.success) {
      setFormError(result.error);
    }
  };

  return (
    <form
      className="auth-form"
      style={{ minWidth: 270, maxWidth: 450, background: "var(--bg-secondary)" }}
      onSubmit={handleSubmit}
    >
      <h2>{isEdit ? "Edit Task" : "New Task"}</h2>
      {(formError || error) && (
        <div className="error">{formError || error}</div>
      )}
      <input
        type="text"
        placeholder="Task title"
        value={title}
        disabled={loading}
        onChange={e => setTitle(e.target.value)}
        required
        autoFocus
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        disabled={loading}
        rows={3}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
          border: "1px solid var(--border-color)",
          borderRadius: 6,
          fontSize: 15,
          resize: "vertical",
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          disabled={loading}
          style={{ flex: 2 }}
        />
        <select
          value={priority}
          onChange={e => setPriority(e.target.value)}
          disabled={loading}
          style={{ flex: 1 }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          disabled={loading}
          style={{ flex: 1 }}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <button className="btn" type="submit" disabled={loading} style={{ marginTop: 15 }}>
        {loading ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save Changes" : "Create Task"}
      </button>
      {onCancel && (
        <button
          className="btn-link"
          type="button"
          style={{ marginTop: 8 }}
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
