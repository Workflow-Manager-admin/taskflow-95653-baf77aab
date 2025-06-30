import React, { useContext, useState } from "react";
import { TaskContext } from "./TaskContext";

// PUBLIC_INTERFACE
export default function TaskFilter() {
  const { filter, setFilterAndReload, sort, setSortAndReload, search, setSearchAndReload } = useContext(TaskContext);

  const [localSearch, setLocalSearch] = useState(search || "");

  const handleApply = e => {
    e.preventDefault();
    setFilterAndReload({
      status: e.target.status.value,
      priority: e.target.priority.value,
      due: e.target.due.value
    });
    setSortAndReload({
      field: e.target.sortfield.value,
      dir: e.target.sortdir.value
    });
    setSearchAndReload(localSearch);
  };

  const handleClear = () => {
    setFilterAndReload({});
    setSortAndReload({});
    setSearchAndReload("");
    setLocalSearch("");
  };

  return (
    <aside
      style={{
        minWidth: 220,
        background: "var(--bg-secondary)",
        borderRadius: 12,
        padding: 20,
        marginRight: 24,
        boxShadow: "0 1px 5px 0 rgba(40,44,52,0.05)",
      }}
    >
      <form onSubmit={handleApply}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Filters</div>
        <div>
          <label>Status</label>
          <select name="status" defaultValue={filter.status || ""}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select name="priority" defaultValue={filter.priority || ""}>
            <option value="">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label>Due Date</label>
          <select name="due" defaultValue={filter.due || ""}>
            <option value="">All</option>
            <option value="today">Due Today</option>
            <option value="week">Due This Week</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div>
          <label>Sort By</label>
          <select name="sortfield" defaultValue={sort.field || ""}>
            <option value="">Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </select>
          <select name="sortdir" defaultValue={sort.dir || ""} style={{ marginLeft: 4 }}>
            <option value="">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>
        <div>
          <label>Search</label>
          <input
            type="search"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Title/Desc"
            style={{ width: "100%" }}
          />
        </div>
        <button className="btn" style={{ marginTop: 12, width: "100%" }}>
          Apply
        </button>
        <button type="button" className="btn-link" onClick={handleClear} style={{ marginTop: 5 }}>
          Clear Filters
        </button>
      </form>
    </aside>
  );
}
