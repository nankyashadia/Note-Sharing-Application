import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import NotesList from './components/NotesList';
import NoteForm from './components/NoteForm';

const API = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u) { 
      setUser(u); 
      fetchNotes(u.username); 
    }
    fetch(`${API}/users`)
      .then(r=>r.json())
      .then(setAllUsers)
      .catch(()=>{});
  }, []);

  function fetchNotes(username) {
    setLoading(true);
    setError(null);
    fetch(`${API}/notes?user=${encodeURIComponent(username)}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch notes');
        return r.json();
      })
      .then(data => {
        setNotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load notes. Please try again.');
        setLoading(false);
      });
  }

  function handleLogin(user) {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    fetchNotes(user.username);
  }

  function handleLogout() {
    setUser(null);
    localStorage.removeItem('user');
    setNotes([]);
  }

  function addNote(note) {
    setLoading(true);
    fetch(`${API}/notes`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ user: user.username, title: note.title, content: note.content, tags: note.tags })
    })
    .then(r => {
      if (!r.ok) throw new Error('Failed to create note');
      return r.json();
    })
    .then(n => {
      setNotes(prev => [n, ...prev]);
      setLoading(false);
      setError(null);
    })
    .catch(err => {
      setError('Failed to create note. Please try again.');
      setLoading(false);
    });
  }

  function updateNote(id, data) {
    setLoading(true);
    fetch(`${API}/notes/${id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    })
    .then(r => {
      if (!r.ok) throw new Error('Failed to update note');
      return r.json();
    })
    .then(n => {
      setNotes(prev => prev.map(p => p.id === n.id ? n : p));
      setEditing(null);
      setLoading(false);
      setError(null);
    })
    .catch(err => {
      setError('Failed to update note. Please try again.');
      setLoading(false);
    });
  }

  function deleteNote(id) {
    setLoading(true);
    fetch(`${API}/notes/${id}`, { method: 'DELETE' })
      .then(r => {
        if (!r.ok) throw new Error('Failed to delete note');
        return r.json();
      })
      .then(() => {
        setNotes(prev => prev.filter(n => n.id !== id));
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        setError('Failed to delete note. Please try again.');
        setLoading(false);
      });
  }

  function shareNote(noteId, username) {
    setLoading(true);
    fetch(`${API}/notes/${noteId}/share`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username })
    })
    .then(r => {
      if (!r.ok) throw new Error('Failed to share note');
      return r.json();
    })
    .then(n => {
      setNotes(prev => prev.map(p => p.id === n.id ? n : p));
      setLoading(false);
      setError(null);
      alert(`Note shared with ${username}!`);
    })
    .catch(err => {
      setError('Failed to share note. Please try again.');
      setLoading(false);
    });
  }

  return (
    <div className="app">
      <header className="hero">
        <h1> MyNoteSpace</h1>
        {user && <div className="user-controls">
          <span>Signed in as <strong>{user.username}</strong></span>
          <button onClick={handleLogout} className="btn">Logout</button>
        </div>}
      </header>
      <main className="container">
        {error && (
          <div className="error-banner">
            <span> {error}</span>
            <button onClick={() => setError(null)} className="close-btn">✕</button>
          </div>
        )}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
          </div>
        )}
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <NoteForm 
              onAdd={addNote} 
              onUpdate={updateNote} 
              editing={editing} 
              onCancel={()=>setEditing(null)} 
            />
            <NotesList 
              notes={notes} 
              onDelete={deleteNote} 
              onEdit={(n)=>setEditing(n)}
              onShare={shareNote}
              allUsers={allUsers}
              currentUser={user.username}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
