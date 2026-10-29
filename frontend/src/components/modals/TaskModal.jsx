import React, { useState, useEffect } from 'react';
import { X, Send, UserCheck, Tag, Flag, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export const TaskModal = ({
  isOpen,
  onClose,
  task = null, // if null -> Create Mode; if provided -> View / Edit Mode
  defaultStatus = 'todo',
  workspace,
  onTaskSaved,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  // Threaded Comments State
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setAssigneeId(task.assigneeId || task.assignee?._id || '');
      setTagsInput(task.tags ? task.tags.join(', ') : '');
      loadComments(task._id);
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setAssigneeId('');
      setTagsInput('');
      setComments([]);
    }
    setFormError(null);
  }, [task, defaultStatus, isOpen]);

  const loadComments = async (taskId) => {
    setCommentsLoading(true);
    try {
      const res = await api.get(`/tasks/${taskId}/comments`);
      setComments(res.data.data || []);
    } catch (err) {
      console.warn('Failed to load comments:', err.message);
    } finally {
      setCommentsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || title.trim().length < 3) {
      setFormError('Task title must be at least 3 characters long.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId: assigneeId || null,
      tags,
    };

    setSaving(true);
    try {
      if (task) {
        // Edit Mode
        const res = await api.patch(`/tasks/${task._id}`, payload);
        onTaskSaved(res.data.data, 'update');
      } else {
        // Create Mode
        const res = await api.post(`/workspaces/${workspace._id}/tasks`, payload);
        onTaskSaved(res.data.data, 'create');
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to save task';
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !task) return;

    setCommentSubmitting(true);
    try {
      // Pick first member or owner as author
      const currentAuthor = workspace?.members?.[0];
      const payload = {
        content: newComment.trim(),
        authorEmail: currentAuthor?.email || 'lead@acme.com',
        authorName: currentAuthor?.name || 'DevPulse Member',
      };

      const res = await api.post(`/tasks/${task._id}/comments`, payload);
      setComments((prev) => [...prev, res.data.data]);
      setNewComment('');
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to post comment');
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className={`status-indicator ${status}`} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
              {task ? 'Task Details' : 'Create New Task'}
            </h2>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="modal-body">
            {formError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Task Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Implement compound index on tasks collection"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                minLength={3}
                maxLength={120}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Provide detailed context, acceptance criteria, or technical notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Status
                </label>
                <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Flag size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Priority
                </label>
                <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <UserCheck size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Assignee
                </label>
                <select
                  className="form-select"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {workspace?.members?.map((m) => (
                    <option key={m.userId || m.email} value={m.userId}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Tag size={13} style={{ display: 'inline', marginRight: '4px' }} />
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="backend, api, database"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
            </div>

            {/* Threaded Discussion Section for existing tasks */}
            {task && (
              <div className="comments-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={16} color="var(--accent-primary)" />
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    Discussion & Activity ({comments.length})
                  </h4>
                </div>

                {commentsLoading ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Loading discussion history...</p>
                ) : comments.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    No comments yet. Start the conversation below.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '180px', overflowY: 'auto' }}>
                    {comments.map((c) => (
                      <div key={c._id} className="comment-item">
                        <img
                          src={
                            c.author?.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              c.author?.name || 'Member'
                            )}`
                          }
                          alt={c.author?.name || 'Author'}
                          className="member-avatar"
                        />
                        <div style={{ flex: 1 }}>
                          <div className="comment-meta">
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {c.author?.name || 'Team Member'}
                            </span>
                            <span>•</span>
                            <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="comment-text">{c.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(e);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddComment}
                    disabled={commentSubmitting || !newComment.trim()}
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
