import React from 'react';
import TaskColumn from './TaskColumn';

const COLUMNS = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const TaskBoard = ({
  tasks = [],
  loading = false,
  onSelectTask,
  onStatusChange,
  onDeleteTask,
  onQuickAdd,
}) => {
  // Partition tasks into columns
  const tasksByColumn = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  return (
    <div className="kanban-board">
      {COLUMNS.map((col) => (
        <TaskColumn
          key={col.id}
          status={col.id}
          title={col.title}
          tasks={tasksByColumn[col.id] || []}
          loading={loading}
          onSelectTask={onSelectTask}
          onStatusChange={onStatusChange}
          onDeleteTask={onDeleteTask}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
};

export default TaskBoard;
