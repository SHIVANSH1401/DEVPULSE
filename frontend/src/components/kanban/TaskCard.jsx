import React, { useState } from 'react';
import {
  MessageSquare,
  MoreVertical,
  Trash2,
  ExternalLink,
  ChevronRight,
  Flame,
  AlertTriangle,
  Minus,
  ArrowDown,
} from 'lucide-react';

const priorityIcons = {
  urgent: <Flame size={12} color="#f87171" />,
  high: <AlertTriangle size={12} color="#f97316" />,
  medium: <Minus size={12} color="#fbbf24" />,
  low: <ArrowDown size={12} color="#38bdf8" />,
};

const statusOrder = ['backlog', 'todo', 'in-progress', 'done'];

export const TaskCard = ({ task, onSelectTask, onStatusChange, onDeleteTask }) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ taskId: task._id, currentStatus: task.status })
    );
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleStatusClick = async (e, targetStatus) => {
    e.stopPropagation();
    setShowStatusMenu(false);
    if (targetStatus === task.status) return;

    try {
      setIsUpdating(true);
      await onStatusChange(task._id, targetStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete task "${task.title}"?`)) {
      onDeleteTask(task._id);
    }
  };

  return (
    <div
      className="task-card"
      draggable={!isUpdating}
      onDragStart={handleDragStart}
      onClick={() => onSelectTask(task)}
      style={{ opacity: isUpdating ? 0.7 : 1 }}
    >
      <div className="task-card-header">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <h4 className="task-card-title" title={task.title}>
            {task.title}
          </h4>
          {task.description && (
            <p className="task-card-desc" title={task.description}>
              {task.description}
            </p>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            className="status-dropdown-btn"
            title="Change status or delete"
            onClick={(e) => {
              e.stopPropagation();
              setShowStatusMenu(!showStatusMenu);
            }}
          >
            <MoreVertical size={16} />
          </button>

          {showStatusMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-elevation)',
                zIndex: 30,
                padding: '0.4rem',
                minWidth: '150px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  padding: '0.2rem 0.5rem',
                  fontWeight: 600,
                }}
              >
                Move to
              </div>
              {statusOrder.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={(e) => handleStatusClick(e, st)}
                  className="btn btn-ghost"
                  style={{
                    justifyContent: 'flex-start',
                    height: '28px',
                    fontSize: '0.78rem',
                    padding: '0.2rem 0.5rem',
                    fontWeight: task.status === st ? 600 : 400,
                    color: task.status === st ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <span
                    className={`status-indicator ${st}`}
                    style={{ width: '6px', height: '6px', marginRight: '6px' }}
                  />
                  {st.replace('-', ' ')}
                </button>
              ))}

              <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.2rem 0' }} />

              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-ghost"
                style={{
                  justifyContent: 'flex-start',
                  height: '28px',
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.5rem',
                  color: '#f87171',
                }}
              >
                <Trash2 size={13} style={{ marginRight: '6px' }} />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="task-tags">
          {task.tags.map((tag, i) => (
            <span key={i} className="tag-badge">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="task-card-footer">
        <span className={`priority-badge ${task.priority || 'medium'}`}>
          {priorityIcons[task.priority || 'medium']}
          {task.priority || 'medium'}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
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
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
              }}
            >
              Unassigned
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
