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
  const [copiedKey, setCopiedKey] = useState(false);

  const ticketKey = task.key || `DP-${task._id.slice(-4).toUpperCase()}`;

  const handleCopyKey = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(ticketKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };

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
      {/* Top Meta Line: Ticket Key + Quick Menu */}
      <div className="task-card-meta-line">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span
            className="ticket-key-badge"
            title="Click to copy ticket ID"
            onClick={handleCopyKey}
          >
            {copiedKey ? 'COPIED!' : ticketKey}
          </span>
          <span className={`status-indicator mini ${task.status}`} />
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
            <MoreVertical size={14} />
          </button>

          {showStatusMenu && (
            <div
              className="popover-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popover-menu-title">Move to status</div>
              {statusOrder.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={(e) => handleStatusClick(e, st)}
                  className={`btn btn-ghost popover-menu-item ${task.status === st ? 'active' : ''}`}
                >
                  <span className={`status-indicator ${st}`} style={{ width: '6px', height: '6px' }} />
                  {st.replace('-', ' ')}
                </button>
              ))}

              <div className="popover-divider" />

              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-ghost popover-menu-item danger"
              >
                <Trash2 size={13} />
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="task-card-content">
        <h4 className="task-card-title" title={task.title}>
          {task.title}
        </h4>
        {task.description && (
          <p className="task-card-desc" title={task.description}>
            {task.description}
          </p>
        )}
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
            <span className="unassigned-text">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
