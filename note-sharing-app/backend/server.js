const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const DATA_DIR = __dirname;
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath)); } catch (e) { return []; }
}
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(USERS_FILE)) writeJSON(USERS_FILE, []);
if (!fs.existsSync(NOTES_FILE)) writeJSON(NOTES_FILE, []);

// Auth
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username and password required' });
  const users = readJSON(USERS_FILE);
  if (users.find(u => u.username === username)) return res.status(409).json({ error: 'User already exists' });
  const hash = bcrypt.hashSync(password, 8);
  const user = { id: Date.now().toString(), username, password: hash };
  users.push(user);
  writeJSON(USERS_FILE, users);
  const { password: p, ...safe } = user;
  res.json(safe);
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
  const { password: p, ...safe } = user;
  res.json(safe);
});

// list users
app.get('/api/users', (req, res) => {
  const users = readJSON(USERS_FILE).map(u => ({ id: u.id, username: u.username }));
  res.json(users);
});

// Notes CRUD
app.get('/api/notes', (req, res) => {
  const user = req.query.user;
  if (!user) return res.status(400).json({ error: 'user query param required' });
  const allNotes = readJSON(NOTES_FILE);
  // Get notes owned by user or shared with user
  const notes = allNotes.filter(n => n.user === user || (n.sharedWith && n.sharedWith.includes(user)));
  res.json(notes);
});

app.get('/api/notes/user/:username', (req, res) => {
  const username = req.params.username;
  const notes = readJSON(NOTES_FILE).filter(n => n.user === username);
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { user, title, content, tags } = req.body;
  if (!user || !content) return res.status(400).json({ error: 'user and content required' });
  const notes = readJSON(NOTES_FILE);
  const note = { 
    id: Date.now().toString(), 
    user, 
    title: title || '', 
    content, 
    tags: tags || [],
    sharedWith: [],
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString() 
  };
  notes.push(note);
  writeJSON(NOTES_FILE, notes);
  res.json(note);
});

app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  const { title, content, tags } = req.body;
  let notes = readJSON(NOTES_FILE);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  if (title !== undefined) notes[idx].title = title;
  if (content !== undefined) notes[idx].content = content;
  if (tags !== undefined) notes[idx].tags = tags;
  notes[idx].updatedAt = new Date().toISOString();
  writeJSON(NOTES_FILE, notes);
  res.json(notes[idx]);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  let notes = readJSON(NOTES_FILE);
  const existed = notes.find(n => n.id === id);
  if (!existed) return res.status(404).json({ error: 'Note not found' });
  notes = notes.filter(n => n.id !== id);
  writeJSON(NOTES_FILE, notes);
  res.json({ success: true });
});

// Share note with other users
app.post('/api/notes/:id/share', (req, res) => {
  const id = req.params.id;
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });
  
  let notes = readJSON(NOTES_FILE);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  
  // Check if user exists
  const users = readJSON(USERS_FILE);
  const targetUser = users.find(u => u.username === username);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });
  
  // Initialize sharedWith if not exists
  if (!notes[idx].sharedWith) notes[idx].sharedWith = [];
  
  // Add user if not already shared
  if (!notes[idx].sharedWith.includes(username)) {
    notes[idx].sharedWith.push(username);
    writeJSON(NOTES_FILE, notes);
  }
  
  res.json(notes[idx]);
});

// Unshare note
app.delete('/api/notes/:id/share/:username', (req, res) => {
  const { id, username } = req.params;
  
  let notes = readJSON(NOTES_FILE);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  
  if (notes[idx].sharedWith) {
    notes[idx].sharedWith = notes[idx].sharedWith.filter(u => u !== username);
    writeJSON(NOTES_FILE, notes);
  }
  
  res.json(notes[idx]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  MyNoteSpace Backend Server               ║
║  Running on http://localhost:${PORT}       ║
║  Ready to accept connections!             ║
╚═══════════════════════════════════════════╝
  `);
});