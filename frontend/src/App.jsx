import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from './components/layout/AppLayout';
import TaskBoard from './components/kanban/TaskBoard';
import TaskModal from './components/modals/TaskModal';
import MemberModal from './components/modals/MemberModal';
import CreateWorkspaceModal from './components/modals/CreateWorkspaceModal';
import { useWorkspace } from './hooks/useWorkspace';
import { useTasks } from './hooks/useTasks';
import { api } from './services/api';

export function App() {
  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('devpulse-theme') || 'dark');

  // Client UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('todo');
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [backendHealth, setBackendHealth] = useState('CHECKING');

  // Debounce search input by 200ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync theme to root html element and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devpulse-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Health check probe
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        if (res.data?.status === 'UP') {
          setBackendHealth('UP');
        } else {
          setBackendHealth('DEGRADED');
        }
      } catch (err) {
        setBackendHealth('OFFLINE');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // Workspace Server State
  const {
    workspace,
    workspaces,
    loading: workspaceLoading,
    error: workspaceError,
    switchWorkspace,
    addMember,
    createWorkspace,
  } = useWorkspace('acme-eng');

  // Task Filter Payload
  const taskFilters = useMemo(() => {
    const f = {};
    if (debouncedSearch.trim()) f.search = debouncedSearch.trim();
    if (priorityFilter) f.priority = priorityFilter;
    return f;
  }, [debouncedSearch, priorityFilter]);

  // Tasks Server State
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
    updateTaskStatus,
    deleteTask,
    setTasks,
  } = useTasks(workspace?._id, taskFilters);

  // Quick Add from specific Kanban Column
  const handleQuickAdd = (status) => {
    setSelectedTask(null);
    setDefaultTaskStatus(status || 'todo');
    setIsTaskModalOpen(true);
  };

  // Click on Task Card
  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Save callback from TaskModal
  const handleTaskSaved = (savedTask, mode) => {
    if (mode === 'create') {
      setTasks((prev) => [savedTask, ...prev]);
    } else {
      setTasks((prev) => prev.map((t) => (t._id === savedTask._id ? savedTask : t)));
    }
  };

  return (
    <AppLayout
      workspace={workspace}
      workspaces={workspaces}
      onSelectWorkspace={switchWorkspace}
      onOpenCreateWorkspace={() => setIsWorkspaceModalOpen(true)}
      onOpenInviteMember={() => setIsMemberModalOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      priorityFilter={priorityFilter}
      onPriorityFilterChange={setPriorityFilter}
      onNewTaskClick={() => handleQuickAdd('todo')}
      theme={theme}
      onToggleTheme={toggleTheme}
      totalTasks={tasks.length}
      healthStatus={backendHealth}
    >
      {workspaceError ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#f87171' }}>Workspace Error</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{workspaceError}</p>
          <button className="btn btn-primary" onClick={() => setIsWorkspaceModalOpen(true)}>
            Create New Workspace
          </button>
        </div>
      ) : (
        <TaskBoard
          tasks={tasks}
          loading={tasksLoading || workspaceLoading}
          onSelectTask={handleSelectTask}
          onStatusChange={updateTaskStatus}
          onDeleteTask={deleteTask}
          onQuickAdd={handleQuickAdd}
        />
      )}

      {/* Controlled Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        defaultStatus={defaultTaskStatus}
        workspace={workspace}
        onTaskSaved={handleTaskSaved}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onInvite={addMember}
        workspaceName={workspace?.name}
      />

      <CreateWorkspaceModal
        isOpen={isWorkspaceModalOpen}
        onClose={() => setIsWorkspaceModalOpen(false)}
        onCreate={createWorkspace}
      />
    </AppLayout>
  );
}

export default App;
