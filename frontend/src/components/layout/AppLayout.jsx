import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export const AppLayout = ({
  workspace,
  workspaces,
  onSelectWorkspace,
  onOpenCreateWorkspace,
  onOpenInviteMember,
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  onNewTaskClick,
  theme,
  onToggleTheme,
  totalTasks,
  healthStatus,
  viewMode = 'kanban',
  onViewModeChange,
  completedTasks = 0,
  children,
}) => {
  return (
    <div className="app-shell" data-theme={theme}>
      <Sidebar
        workspace={workspace}
        workspaces={workspaces}
        onSelectWorkspace={onSelectWorkspace}
        onOpenCreateWorkspace={onOpenCreateWorkspace}
        onOpenInviteMember={onOpenInviteMember}
        healthStatus={healthStatus}
      />

      <div className="main-viewport">
        <Header
          workspaceName={workspace?.name}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={onPriorityFilterChange}
          onNewTaskClick={onNewTaskClick}
          theme={theme}
          onToggleTheme={onToggleTheme}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />

        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
