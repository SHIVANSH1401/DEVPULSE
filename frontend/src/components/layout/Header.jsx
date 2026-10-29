import React, { useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Sun,
  Moon,
  Kanban,
  List,
  Sparkles,
  Command,
} from 'lucide-react';

export const Header = ({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onNewTaskClick,
  theme,
  onToggleTheme,
  workspaceName,
  totalTasks,
  viewMode = 'kanban',
  onViewModeChange,
  completedTasks = 0,
}) => {
  const searchInputRef = useRef(null);

  // Global shortcut: '/' or 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="header-bar">
      {/* Breadcrumb & Title */}
      <div className="header-left">
        <div className="header-breadcrumbs">
          <span className="breadcrumb-root">Workspaces</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{workspaceName || 'DevPulse'}</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-pill">Sprint Engine</span>
        </div>

        <div className="sprint-progress-wrap" title={`${completedTasks} of ${totalTasks} tasks completed`}>
          <div className="sprint-progress-bar">
            <div
              className="sprint-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="sprint-progress-text">{progressPercent}% done</span>
        </div>
      </div>

      {/* Real-time search with instant filter */}
      <div className="header-search">
        <Search size={15} className="header-search-icon" />
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Filter or search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="keyboard-shortcut-hint">
          <span>/</span>
        </div>
      </div>

      {/* View Switcher, Filter and Action controls */}
      <div className="filter-group">
        {/* Kanban vs List Switcher */}
        {onViewModeChange && (
          <div className="view-toggle-group">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => onViewModeChange('kanban')}
              title="Board View"
            >
              <Kanban size={14} />
              <span>Board</span>
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => onViewModeChange('list')}
              title="List View"
            >
              <List size={14} />
              <span>Stream</span>
            </button>
          </div>
        )}

        {/* Priority Filter */}
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          title="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Theme Toggle */}
        <button
          type="button"
          className="btn btn-ghost theme-toggle-btn"
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Create Task Button with 'C' hotkey hint */}
        <button
          type="button"
          className="btn btn-primary new-task-btn"
          onClick={onNewTaskClick}
          id="btn-new-task"
          title="Create New Task (Press 'C')"
        >
          <Plus size={15} />
          <span>New Task</span>
          <kbd className="btn-hotkey">C</kbd>
        </button>
      </div>
    </header>
  );
};

export default Header;
