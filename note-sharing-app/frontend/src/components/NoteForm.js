import React, { useState, useEffect } from 'react';
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

  function submit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    if (editing) {
      onUpdate(editing.id, { title, content, tags });
    } else {
      onAdd({ title, content, tags });
    }
    setTitle(''); 
    setContent('');
    setTags([]);
  }

  function addTag(e) {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  }

  function removeTag(tag) {
    setTags(tags.filter(t => t !== tag));
  }

  return (
    <div className="card note-form">
      <h2>{editing ? '✏️ Edit Note' : '📝 Create New Note'}</h2>
      <form onSubmit={submit}>
        <input 
          placeholder="Title (optional)" 
          value={title} 
          onChange={e=>setTitle(e.target.value)} 
          className="title-input"
        />
        <SimpleMDE 
          value={content} 
          onChange={setContent}
          options={{
            placeholder: "Write your note in Markdown...",
            spellChecker: false,
            minHeight: "150px"
          }}
        />
        <div className="tags-section">
          <div className="tag-input-wrapper">
            <input 
              placeholder="Add tags (e.g., work, personal, ideas)" 
              value={tagInput} 
              onChange={e=>setTagInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addTag(e)}
              className="tag-input"
            />
            <button type="button" onClick={addTag} className="btn small">+ Add Tag</button>
          </div>
          {tags.length > 0 && (
            <div className="tags-display">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="tag-remove">×</button>
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="row">
          <button className="btn primary" type="submit">
            {editing ? '💾 Update Note' : '➕ Add Note'}
          </button>
          {editing && <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
