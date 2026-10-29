import { useState } from 'react';
import { api } from '../services/api';

export const useCreateTask = (workspaceId, onCreated) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTask = async (taskData) => {
    if (!workspaceId) {
      throw new Error('Workspace ID is required to create a task');
    }
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(`/workspaces/${workspaceId}/tasks`, taskData);
      if (onCreated) {
        onCreated(response.data.data);
      }
      return response.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to create task';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTask,
    loading,
    error,
    resetError: () => setError(null),
  };
};
