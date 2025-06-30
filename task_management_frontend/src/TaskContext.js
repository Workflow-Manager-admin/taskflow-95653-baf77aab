import React, { createContext, useState, useCallback, useContext } from "react";
import { taskApi } from "./taskService";
import { AuthContext } from "./AuthContext";

// PUBLIC_INTERFACE
export const TaskContext = createContext(null);

/**
 * PUBLIC_INTERFACE
 * TaskProvider - manages task state and CRUD/filter logic for child components.
 */
export function TaskProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  // PUBLIC_INTERFACE
  const fetchTasks = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await taskApi.getTasks({
          token,
          filter: opts.filter || filter,
          sort: opts.sort || sort,
          search: opts.search || search,
        });
        setTasks(data);
        setLoading(false);
      } catch (e) {
        setError(e.message || "Failed to load tasks");
        setLoading(false);
      }
    },
    [token, filter, sort, search]
  );

  // PUBLIC_INTERFACE
  const reloadTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  // PUBLIC_INTERFACE
  const fetchTaskById = async id => {
    setLoading(true);
    setError(null);
    try {
      const t = await taskApi.getTask(id, token);
      setSelectedTask(t);
      setLoading(false);
      return t;
    } catch (e) {
      setError(e.message);
      setLoading(false);
      throw e;
    }
  };

  // PUBLIC_INTERFACE
  const createTask = async taskData => {
    setLoading(true);
    setError(null);
    try {
      await taskApi.createTask(taskData, token);
      await fetchTasks();
      setLoading(false);
      return { success: true };
    } catch (e) {
      setError(e.message || "Failed to create task");
      setLoading(false);
      return { success: false, error: e.message };
    }
  };

  // PUBLIC_INTERFACE
  const updateTask = async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      await taskApi.updateTask(id, taskData, token);
      await fetchTasks();
      setLoading(false);
      return { success: true };
    } catch (e) {
      setError(e.message || "Failed to update task");
      setLoading(false);
      return { success: false, error: e.message };
    }
  };

  // PUBLIC_INTERFACE
  const deleteTask = async id => {
    setLoading(true);
    setError(null);
    try {
      await taskApi.deleteTask(id, token);
      await fetchTasks();
      setSelectedTask(null);
      setLoading(false);
      return { success: true };
    } catch (e) {
      setError(e.message || "Failed to delete task");
      setLoading(false);
      return { success: false, error: e.message };
    }
  };

  // PUBLIC_INTERFACE
  const selectTask = id => {
    const t = tasks.find(t => t.id === id);
    setSelectedTask(t || null);
  };

  // PUBLIC_INTERFACE
  const setFilterAndReload = newFilter => {
    setFilter(newFilter);
    fetchTasks({ filter: newFilter });
  };

  // PUBLIC_INTERFACE
  const setSortAndReload = newSort => {
    setSort(newSort);
    fetchTasks({ sort: newSort });
  };

  // PUBLIC_INTERFACE
  const setSearchAndReload = newSearch => {
    setSearch(newSearch);
    fetchTasks({ search: newSearch });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        selectedTask,
        filter,
        sort,
        search,
        fetchTasks,
        reloadTasks,
        fetchTaskById,
        createTask,
        updateTask,
        deleteTask,
        selectTask,
        setFilterAndReload,
        setSortAndReload,
        setSearchAndReload,
        setSelectedTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
