import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function NotesList({ notes, onDelete, onEdit, onShare, allUsers, currentUser }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [showShareModal, setShowShareModal] = useState(null);
  const [shareUsername, setShareUsername] = useState('');
  
  const list = Array.isArray(notes) ? notes : [];
  const q = (query || '').toLowerCase();
  
  // Get all unique tags
  const allTags = [...new Set(list.flatMap(n => n.tags || []))];
  
  const filtered = list.filter(n => {
    const matchesSearch = (n.title || '').toLowerCase().includes(q) ||
                         (n.content || '').toLowerCase().includes(q);
    const matchesTag = !selectedTag || (n.tags && n.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  function handleShare(noteId) {
    if (shareUsername.trim()) {
      onShare(noteId, shareUsername.trim());
      setShowShareModal(null);
      setShareUsername('');
    }
  }

  const otherUsers = allUsers.filter(u => u.username !== currentUser);

  if (!notes) return null;
  
  return (
    <div>
      <div className="filters-section">
        <input 
          placeholder="🔍 Search notes..." 
          value={query} 
          onChange={e=>setQuery(e.target.value)} 
          className="search" 
        />
        {allTags.length > 0 && (
          <div className="tag-filter">
            <button 
              className={`tag-filter-btn ${!selectedTag ? 'active' : ''}`}
              onClick={() => setSelectedTag('')}
            >
              All
            </button>
            {allTags.map(tag => (
              <button 
                key={tag}
                className={`tag-filter-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {filtered.length === 0 ? (
        <p className="empty">
          {query || selectedTag ? '🔍 No matching notes found.' : '📭 No notes yet. Create your first note!'}
        </p>
      ) : (
        <div className="notes-grid">
          {filtered.map(n => {
            const isShared = n.user !== currentUser;
            return (
              <article key={n.id} className={`note-card ${isShared ? 'shared-note' : ''}`}>
                {isShared && <div className="shared-badge">📨 Shared by {n.user}</div>}
                <h3>{n.title || 'Untitled'}</h3>
                {n.tags && n.tags.length > 0 && (
                  <div className="tags-display">
                    {n.tags.map(tag => (
                      <span key={tag} className="tag small">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="content">
                  <SafeMarkdown value={String(n.content ?? '')} />
                </div>
                <div className="meta">
                  <small>
                    {new Date(n.updatedAt || n.createdAt).toLocaleString([], {
                      year:'numeric', 
                      month:'short', 
                      day:'2-digit', 
                      hour:'2-digit', 
                      minute:'2-digit'
                    })}
                  </small>
                  <div className="row">
                    {!isShared && (
                      <>
                        <button className="btn small" onClick={()=>onEdit(n)}>✏️ Edit</button>
                        <button 
                          className="btn small secondary" 
                          onClick={()=>setShowShareModal(n.id)}
                        >
                          📤 Share
                        </button>
                        <button 
                          className="btn small danger" 
                          onClick={()=>{ 
                            if (window.confirm('Delete this note? This cannot be undone.')) 
                              onDelete(n.id); 
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {n.sharedWith && n.sharedWith.length > 0 && !isShared && (
                  <div className="shared-info">
                    Shared with: {n.sharedWith.join(', ')}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Share Note</h3>
            <p>Select a user to share this note with:</p>
            {otherUsers.length === 0 ? (
              <p className="empty">No other users available</p>
            ) : (
              <select 
                value={shareUsername} 
                onChange={e => setShareUsername(e.target.value)}
                className="share-select"
              >
                <option value="">Select a user...</option>
                {otherUsers.map(u => (
                  <option key={u.username} value={u.username}>{u.username}</option>
                ))}
              </select>
            )}
            <div className="row">
              <button 
                className="btn primary" 
                onClick={() => handleShare(showShareModal)}
                disabled={!shareUsername}
              >
                Share
              </button>
              <button 
                className="btn ghost" 
                onClick={() => {
                  setShowShareModal(null);
                  setShareUsername('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

class MarkdownBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return <pre style={{whiteSpace:'pre-wrap'}}>{this.props.fallback}</pre>;
    }
    return this.props.children;
  }
}

function SafeMarkdown({ value }) {
  const safe = typeof value === 'string' ? value : '';
  return (
    <MarkdownBoundary fallback={safe}>
      <ReactMarkdown skipHtml={true}>{safe}</ReactMarkdown>
    </MarkdownBoundary>
  );
}
