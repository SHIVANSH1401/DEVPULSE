import React from 'react';
import {
  Flame,
  AlertTriangle,
  Minus,
  ArrowDown,
  MessageSquare,
  MoreVertical,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Inbox,
} from 'lucide-react';

const priorityConfig = {
  urgent: { label: 'Urgent', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', icon: Flame },
  high: { label: 'High', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', icon: AlertTriangle },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', icon: Minus },
  low: { label: 'Low', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: ArrowDown },
};

const statusConfig = {
  backlog: { label: 'Backlog', color: '#64748b' },
  todo: { label: 'To Do', color: '#38bdf8' },
  'in-progress': { label: 'In Progress', color: '#fbbf24' },
  done: { label: 'Done', color: '#34d399' },
};

export const TaskListView = ({
  tasks = [],
  loading = false,
  onSelectTask,
  onStatusChange,
  onDeleteTask,
}) => {
  if (loading) {
    return (
      <div className="list-view-container">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="list-view-row skeleton-shimmer" style={{ height: '56px', marginBottom: '8px' }} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '4rem 1rem' }}>
        <Inbox size={36} color="var(--text-muted)" />
        <h4 style={{ marginTop: '0.8rem', color: 'var(--text-primary)' }}>No tasks found</h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Try clearing search filters or create a new task to get started.
        </p>
      </div>
    );
  }

  const statuses = ['in-progress', 'todo', 'backlog', 'done'];

  return (
    <div className="list-view-container">
      {statuses.map((statusKey) => {
        const groupTasks = tasks.filter((t) => t.status === statusKey);
        if (groupTasks.length === 0) return null;
        const config = statusConfig[statusKey];

        return (
          <div key={statusKey} className="list-group">
            <div className="list-group-header">
              <span className={`status-indicator ${statusKey}`} />
              <span className="list-group-title">{config.label}</span>
              <span className="list-group-count">{groupTasks.length}</span>
            </div>

            <div className="list-group-body">
              {groupTasks.map((task) => {
                const priority = priorityConfig[task.priority || 'medium'];
                const PriorityIcon = priority.icon;
                const ticketKey = task.key || `DP-${task._id.slice(-4).toUpperCase()}`;

                return (
                  <div
                    key={task._id}
                    className="list-row"
                    onClick={() => onSelectTask(task)}
                  >
                    {/* Status quick toggle */}
                    <button
                      type="button"
                      className="list-status-btn"
                      title={`Status: ${config.label}. Click to cycle.`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const next =
                          statusKey === 'backlog'
                            ? 'todo'
                            : statusKey === 'todo'
                            ? 'in-progress'
                            : statusKey === 'in-progress'
                            ? 'done'
                            : 'todo';
                        onStatusChange(task._id, next);
                      }}
                    >
                      {statusKey === 'done' ? (
                        <CheckCircle2 size={16} color="#34d399" />
                      ) : (
                        <Circle size={15} color={config.color} />
                      )}
                    </button>

                    {/* Ticket Key */}
                    <span className="list-ticket-key">{ticketKey}</span>

                    {/* Title & Description */}
                    <div className="list-title-wrap">
                      <span className="list-task-title">{task.title}</span>
                      {task.tags && task.tags.length > 0 && (
                        <div className="list-tags">
                          {task.tags.map((t, idx) => (
                            <span key={idx} className="tag-badge">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Priority Badge */}
                    <div
                      className="priority-badge"
                      style={{
                        background: priority.bg,
                        color: priority.color,
                        border: `1px solid ${priority.color}33`,
                      }}
                    >
                      <PriorityIcon size={12} />
                      <span>{priority.label}</span>
                    </div>

                    {/* Assignee */}
                    <div className="list-assignee">
                      {task.assignee ? (
                        <img
                          src={
                            task.assignee.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              task.assignee.name || 'User'
                            )}`
                          }
                          alt={task.assignee.name || 'Assignee'}
                          title={`Assigned to ${task.assignee.name || task.assignee.email}`}
                          className="member-avatar"
                        />
                      ) : (
                        <span className="unassigned-text">Unassigned</span>
                      )}
                    </div>

                    {/* Date / Timestamp */}
                    <div className="list-date">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Today'}
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      className="list-delete-btn"
                      title="Delete task"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete task "${task.title}"?`)) {
                          onDeleteTask(task._id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskListView;

