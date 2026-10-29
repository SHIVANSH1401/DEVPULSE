import React, { useState } from 'react';
import {
  Kanban,
  Users,
  ChevronDown,
  PlusCircle,
  Activity,
  Layers,
  Settings,
  ShieldAlert,
  FolderGit2,
} from 'lucide-react';

export const Sidebar = ({
  workspace,
  workspaces = [],
  onSelectWorkspace,
  onOpenCreateWorkspace,
  onOpenInviteMember,
  healthStatus = 'UP',
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.4rem' }}>
        <div className="workspace-brand-logo">DP</div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em' }}>DevPulse</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MERN Task Engine</span>
        </div>
      </div>

      {/* Workspace Switcher */}
      <div style={{ position: 'relative' }}>
        <div
          className="workspace-switcher"
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#818cf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {workspace?.name ? workspace.name.charAt(0).toUpperCase() : 'W'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {workspace?.name || 'Select Workspace'}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                /{workspace?.slug || 'none'}
              </span>
            </div>
          </div>
          <ChevronDown size={15} color="var(--text-muted)" />
        </div>

        {/* Workspace Dropdown */}
        {showWorkspaceMenu && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              marginTop: '0.35rem',
              boxShadow: 'var(--shadow-elevation)',
              zIndex: 40,
              padding: '0.4rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}
          >
            <div className="sidebar-section-title" style={{ padding: '0.3rem 0.5rem 0.1rem' }}>
              Switch Workspace
            </div>
            {workspaces.map((ws) => (
              <button
                key={ws._id}
                type="button"
                className="btn btn-ghost"
                style={{
                  justifyContent: 'flex-start',
                  fontSize: '0.82rem',
                  height: '32px',
                  padding: '0 0.6rem',
                  color: ws.slug === workspace?.slug ? 'var(--accent-primary)' : 'var(--text-primary)',
                  fontWeight: ws.slug === workspace?.slug ? 600 : 400,
                }}
                onClick={() => {
                  onSelectWorkspace(ws.slug);
                  setShowWorkspaceMenu(false);
                }}
              >
                {ws.name}
              </button>
            ))}

            <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '0.2rem 0' }} />

            <button
              type="button"
              className="btn btn-ghost"
              style={{
                justifyContent: 'flex-start',
                fontSize: '0.82rem',
                height: '32px',
                padding: '0 0.6rem',
                color: 'var(--accent-primary)',
              }}
              onClick={() => {
                setShowWorkspaceMenu(false);
                onOpenCreateWorkspace();
              }}
            >
              <PlusCircle size={14} style={{ marginRight: '6px' }} />
              Create Workspace
            </button>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Views</div>
        <a href="#board" className="sidebar-link active">
          <Kanban size={16} />
          Kanban Board
        </a>
      </nav>

      {/* Workspace Members Section */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0.4rem',
            marginBottom: '0.5rem',
          }}
        >
          <div className="sidebar-section-title" style={{ padding: 0, margin: 0 }}>
            Members ({workspace?.members?.length || 0})
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: '22px', height: '22px', padding: 0 }}
            title="Invite new member"
            onClick={onOpenInviteMember}
          >
            <PlusCircle size={14} color="var(--accent-primary)" />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {workspace?.members?.map((m) => (
            <div key={m.userId || m.email} className="member-pill">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.name)}`}
                alt={m.name}
                className="member-avatar"
              />
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {m.name}
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {m.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / System Status */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: healthStatus === 'UP' ? '#34d399' : '#f87171',
                boxShadow: healthStatus === 'UP' ? '0 0 8px rgba(52, 211, 153, 0.6)' : 'none',
              }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Backend: <strong>{healthStatus}</strong>
            </span>
          </div>
          <a
            href="/api/v1/health"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', textDecoration: 'none' }}
          >
            Health Probe
          </a>
        </div>

        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          DevPulse Engine &bull; MERN v1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
