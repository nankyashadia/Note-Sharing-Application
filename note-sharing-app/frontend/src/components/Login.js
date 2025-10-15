import React, { useState } from 'react';
const API = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [mode, setMode] = useState('login'); // or register
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(e) {
    e.preventDefault();
    setMessage('');
    
    if (mode === 'register' && password !== confirm) {
      setMessage(' Passwords do not match');
      return;
    }
    
    if (password.length < 4) {
      setMessage(' Password must be at least 4 characters');
      return;
    }
    
    setLoading(true);
    setMessage('⏳ Please wait...');
    
    const url = mode === 'login' ? `${API}/auth/login` : `${API}/auth/register`;
    fetch(url, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ username, password })
    }).then(async r => {
      const data = await r.json();
      setLoading(false);
      if (!r.ok) {
        setMessage(`❌ ${data.error || 'Error'}`);
      } else {
        if (mode === 'register') {
          setMessage('✅ Account created successfully! Please log in.');
          setMode('login');
          setPassword('');
          setConfirm('');
        } else {
          setMessage('');
          onLogin(data);
        }
      }
    }).catch(err => {
      setLoading(false);
      setMessage('❌ Network error: cannot reach backend at http://localhost:4000');
    });
  }

  return (
    <div className="card auth">
      <h2>{mode === 'login' ? '🔐 Login' : '📝 Create Account'}</h2>
      <form onSubmit={submit}>
        <label>Username</label>
        <input 
          value={username} 
          onChange={e=>setUsername(e.target.value)} 
          required 
          minLength="3"
          placeholder="Enter your username"
          disabled={loading}
        />
        <label>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          required 
          minLength="4"
          placeholder="Enter your password"
          disabled={loading}
        />
        {mode === 'register' && <>
          <label>Confirm password</label>
          <input 
            type="password" 
            value={confirm} 
            onChange={e=>setConfirm(e.target.value)} 
            required 
            placeholder="Confirm your password"
            disabled={loading}
          />
        </>}
        <div className="row">
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? '⏳ Loading...' : (mode === 'login' ? '🔓 Login' : '✨ Register')}
          </button>
          <button 
            type="button" 
            className="btn ghost" 
            onClick={()=>{
              setMode(mode==='login'?'register':'login');
              setMessage('');
            }}
            disabled={loading}
          >
            {mode === 'login' ? 'Create account' : 'Have account? Login'}
          </button>
        </div>
      </form>
      {message && (
        <p className={`message ${message.includes('✅') ? 'success' : ''}`}>
          {message}
        </p>
      )}
    </div>
  );
}
