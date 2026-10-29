import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useTasks = (workspaceId, filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 50, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterString = JSON.stringify(filters);

  const fetchTasks = useCallback(async () => {
    if (!workspaceId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/workspaces/${workspaceId}/tasks`, {
        params: { limit: 50, ...filters },
      });
      setTasks(response.data.data.tasks || []);
      setPagination(response.data.data.pagination || { page: 1, limit: 50, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [workspaceId, filterString]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Optimistic status update with instant UI feedback and server synchronization
  const updateTaskStatus = async (taskId, newStatus) => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t))
    );

    try {
      const res = await api.patch(`/tasks/${taskId}`, { status: newStatus });
      // Sync with updated server timestamp
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...res.data.data } : t))
      );
      return res.data.data;
    } catch (err) {
      // Rollback on failure
      setTasks(previousTasks);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  return {
    tasks,
    pagination,
    loading,
    error,
    refetch: fetchTasks,
    updateTaskStatus,
    deleteTask,
    setTasks,
  };
};
