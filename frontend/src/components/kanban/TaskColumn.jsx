import React, { useState } from 'react';
import { Plus, Inbox } from 'lucide-react';
import TaskCard from './TaskCard';
import SkeletonLoader from '../common/SkeletonLoader';

export const TaskColumn = ({
  title,
  status,
  tasks = [],
  loading = false,
  onSelectTask,
  onStatusChange,
  onDeleteTask,
  onQuickAdd,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const data = e.dataTransfer.getData('application/json');
      if (!data) return;
      const { taskId, currentStatus } = JSON.parse(data);
      if (taskId && currentStatus !== status) {
        await onStatusChange(taskId, status);
      }
    } catch (err) {
      console.error('Drag-and-drop status update error:', err);
    }
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <div className="column-title-wrap">
          <span className={`status-indicator ${status}`} />
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{title}</h3>
          <span className="column-badge">{loading ? '...' : tasks.length}</span>
        </div>

        <button
          type="button"
          className="btn btn-ghost"
          style={{ width: '28px', height: '28px', padding: 0 }}
          title={`Add task to ${title}`}
          onClick={() => onQuickAdd(status)}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="column-cards-container">
        {loading ? (
          <SkeletonLoader count={3} />
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <Inbox size={28} strokeWidth={1.5} />
            <p style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>No tasks in {title.toLowerCase()}</p>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ height: '30px', fontSize: '0.78rem', marginTop: '0.5rem' }}
              onClick={() => onQuickAdd(status)}
            >
              <Plus size={13} />
              Add Task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onSelectTask={onSelectTask}
              onStatusChange={onStatusChange}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
