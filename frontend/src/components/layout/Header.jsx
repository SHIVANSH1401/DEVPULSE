import React from 'react';
import { Search, Plus, Filter, Sun, Moon, Sparkles } from 'lucide-react';

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
}) => {
  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {workspaceName || 'DevPulse'}
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.06)',
                padding: '0.15rem 0.5rem',
                borderRadius: '6px',
              }}
            >
              {totalTasks} tasks
            </span>
          </h1>
        </div>
      </div>

      {/* Real-time search with instant filter */}
      <div className="header-search">
        <Search size={16} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search tasks by title (case-insensitive)..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter and Action controls */}
      <div className="filter-group">
        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => onPriorityFilterChange(e.target.value)}
          title="Filter by priority"
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent Priority</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: '38px', height: '38px', padding: 0 }}
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onNewTaskClick}
          id="btn-new-task"
        >
          <Plus size={16} />
          New Task
        </button>
      </div>
    </header>
  );
};

export default Header;
