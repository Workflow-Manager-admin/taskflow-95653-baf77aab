const API_BASE = "/api";

// PUBLIC_INTERFACE
export const taskApi = {
  /**
   * PUBLIC_INTERFACE
   * Get all tasks for current user, supports filtering and sorting.
   * @param {object} options (optional) {filter, sort, search, token}
   * @returns {Promise<Array>}
   */
  async getTasks({ token, filter = {}, sort = {}, search = "" } = {}) {
    let params = [];
    if (filter.status) params.push(`status=${encodeURIComponent(filter.status)}`);
    if (filter.priority) params.push(`priority=${encodeURIComponent(filter.priority)}`);
    if (filter.due) params.push(`due=${encodeURIComponent(filter.due)}`);
    if (sort.field) params.push(`sort=${encodeURIComponent(sort.field)}`);
    if (sort.dir) params.push(`dir=${encodeURIComponent(sort.dir)}`);
    if (search) params.push(`q=${encodeURIComponent(search)}`);
    const url = `${API_BASE}/tasks${params.length ? "?" + params.join("&") : ""}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch tasks");
    }
    return res.json();
  },

  /**
   * PUBLIC_INTERFACE
   * Get a single task by ID.
   * @param {string} id
   * @param {string} token
   * @returns {Promise<Object>}
   */
  async getTask(id, token) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch task");
    }
    return res.json();
  },

  /**
   * PUBLIC_INTERFACE
   * Create a new task.
   * @param {object} taskData
   * @param {string} token
   * @returns {Promise<Object>}
   */
  async createTask(taskData, token) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create task");
    }
    return res.json();
  },

  /**
   * PUBLIC_INTERFACE
   * Update an existing task.
   * @param {string} id
   * @param {object} taskData
   * @param {string} token
   * @returns {Promise<Object>}
   */
  async updateTask(id, taskData, token) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update task");
    }
    return res.json();
  },

  /**
   * PUBLIC_INTERFACE
   * Delete a task.
   * @param {string} id
   * @param {string} token
   * @returns {Promise<{success: boolean}>}
   */
  async deleteTask(id, token) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to delete task");
    }
    return res.json();
  }
};
