import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function NoteForm({ onAdd, onUpdate, editing, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(()=> {
    if (editing) {
      setTitle(editing.title || '');
      setContent(editing.content || '');
      setTags(editing.tags || []);
    } else {
      setTitle(''); 
      setContent('');
      setTags([]);
    }
  }, [editing]);

  // Memoize SimpleMDE options to prevent re-renders
  const editorOptions = useMemo(() => ({
    placeholder: "Write your note in Markdown...",
    spellChecker: false,
    minHeight: "150px",
    autofocus: false,
    status: false
  }), []);

  const submit = useCallback((e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert(' Please write some content for your note!');
      return;
    }
    if (editing) {
      onUpdate(editing.id, { title, content, tags });
    } else {
      onAdd({ title, content, tags });
    }
    setTitle(''); 
    setContent('');
    setTags([]);
  }, [content, editing, onUpdate, onAdd, title, tags]);

  const addTag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const tag = tagInput.trim().toLowerCase();
    if (!tag) {
      return;
    }
    if (tags.includes(tag)) {
      alert(' Tag already added!');
      setTagInput('');
      return;
    }
    if (tag.length > 20) {
      alert(' Tag is too long! Keep it under 20 characters.');
      return;
    }
    setTags(prevTags => [...prevTags, tag]);
    setTagInput('');
    // Show success feedback
    const btn = e.target;
    if (btn.textContent) {
      const originalText = btn.textContent;
      btn.textContent = '✓ Added!';
      setTimeout(() => {
        btn.textContent = originalText;
      }, 1000);
    }
  }, [tagInput, tags]);

  const removeTag = useCallback((tag) => {
    setTags(prevTags => prevTags.filter(t => t !== tag));
  }, []);

  const handleContentChange = useCallback((value) => {
    setContent(value);
  }, []);

  return (
    <div className="card note-form">
      <h2>{editing ? ' Edit Note' : ' Create New Note'}</h2>
      <form onSubmit={submit}>
        <input 
          placeholder="Title (optional)" 
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          className="title-input"
        />
        <SimpleMDE 
          value={content} 
          onChange={handleContentChange}
          options={editorOptions}
        />
        <div className="tags-section">
          <label className="tags-label">
             Tags {tags.length > 0 && <span className="tag-count">({tags.length})</span>}
          </label>
          <div className="tag-input-wrapper">
            <input 
              type="text"
              placeholder="Add tags (e.g., work, personal, ideas)" 
              value={tagInput} 
              onChange={e=>setTagInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  addTag(e);
                }
              }}
              className="tag-input"
              maxLength={20}
            />
            <button 
              type="button" 
              onClick={addTag} 
              className="btn small primary"
              disabled={!tagInput.trim()}
            >
              + Add Tag
            </button>
          </div>
          {tags.length > 0 ? (
            <div className="tags-display">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)} 
                    className="tag-remove"
                    title="Remove tag"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="tags-hint"> Add tags to organize your notes</p>
          )}
        </div>
        <div className="row">
          <button className="btn primary" type="submit">
            {editing ? ' Update Note' : ' Add Note'}
          </button>
          {editing && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
