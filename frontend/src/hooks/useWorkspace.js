import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const useWorkspace = (initialSlug = 'acme-eng') => {
  const [workspace, setWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all workspaces for switcher
  const fetchWorkspaces = useCallback(async () => {
    try {
      const res = await api.get('/workspaces');
      if (res.data?.data) {
        setWorkspaces(res.data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch workspaces list:', err.message);
    }
  }, []);

  // Fetch specific workspace by slug
  const fetchWorkspaceBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/workspaces/${slug}`);
      setWorkspace(res.data.data);
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || `Failed to load workspace '${slug}'`;
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/workspaces');
        const list = res.data?.data || [];
        setWorkspaces(list);

        const target = list.find((w) => w.slug === initialSlug) || list[0];
        if (target) {
          fetchWorkspaceBySlug(target.slug);
        } else {
          fetchWorkspaceBySlug(initialSlug);
        }
      } catch (err) {
        fetchWorkspaceBySlug(initialSlug);
      }
    };
    init();
  }, [fetchWorkspaceBySlug, initialSlug]);

  const switchWorkspace = (slug) => {
    return fetchWorkspaceBySlug(slug);
  };

  const addMember = async (memberData) => {
    if (!workspace?.slug) return;
    const res = await api.post(`/workspaces/${workspace.slug}/members`, memberData);
    setWorkspace(res.data.data);
    await fetchWorkspaces();
    return res.data.data;
  };

  const createWorkspace = async (workspaceData) => {
    const res = await api.post('/workspaces', workspaceData);
    const newWs = res.data.data;
    await fetchWorkspaces();
    setWorkspace(newWs);
    return newWs;
  };

  return {
    workspace,
    workspaces,
    loading,
    error,
    switchWorkspace,
    addMember,
    createWorkspace,
    refetch: () => fetchWorkspaceBySlug(workspace?.slug || initialSlug),
  };
};
