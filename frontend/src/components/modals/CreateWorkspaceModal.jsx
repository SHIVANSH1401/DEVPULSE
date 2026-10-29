import React, { useState } from 'react';
import { X, Building2, AlertCircle } from 'lucide-react';

export const CreateWorkspaceModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [ownerName, setOwnerName] = useState('Sarah Lead');
  const [ownerEmail, setOwnerEmail] = useState('lead@acme.com');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    // Auto-generate slug
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !slug.trim() || !ownerName.trim() || !ownerEmail.trim()) {
      setError('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        slug: slug.trim(),
        ownerName: ownerName.trim(),
        ownerEmail: ownerEmail.trim(),
        description: description.trim(),
      });
      setName('');
      setSlug('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create workspace');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Building2 size={18} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Create New Workspace</h2>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose} style={{ padding: '0.4rem' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
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
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Workspace Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Acme Mobile Engineering"
                value={name}
                onChange={handleNameChange}
                required
                minLength={2}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unique Slug * (URL identifier)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. acme-mobile"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                required
                pattern="^[a-z0-9-]+$"
                title="Only lowercase letters, numbers, and hyphens"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Sarah Lead"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Owner Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="lead@acme.com"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Brief summary of this team or organization..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;
