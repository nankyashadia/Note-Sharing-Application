# MyNoteSpace - Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- A modern web browser

### Installation

#### Option 1: Using the setup script (Mac/Linux)
```bash
chmod +x setup.sh
./setup.sh
```

#### Option 2: Manual setup
```bash
# Backend
cd backend
npm install
cp .env.example .env  # optional
npm start

# Frontend (in new terminal)
cd frontend
npm install
cp .env.example .env  # optional
npm start
```

## 📂 Project Structure Explained

### Backend (`/backend`)
- **server.js**: Main Express server with all API routes
- **users.json**: Auto-generated user database
- **notes.json**: Auto-generated notes database
- **.env**: Environment configuration (optional)

### Frontend (`/frontend`)
- **src/App.js**: Main React component, manages app state
- **src/components/**: Reusable React components
- **src/styles.css**: All styling with CSS animations
- **src/index.js**: React entry point
- **src/index.html**: HTML template

## 🔧 Configuration

### Backend Environment Variables (`.env`)
```
PORT=4000              # Server port
NODE_ENV=development   # Environment
```

### Frontend Environment Variables (`.env`)
```
REACT_APP_API_URL=http://localhost:4000/api
```

## 🎨 Customization Guide

### Changing Colors
Edit `frontend/src/styles.css`:
```css
:root {
  --primary: #7c3aed;       /* Main purple color */
  --secondary: #10b981;     /* Green for success */
  --danger: #ef4444;        /* Red for danger */
}
```

### Adding New Features
1. **Backend**: Add routes in `backend/server.js`
2. **Frontend**: Create component in `frontend/src/components/`
3. **Update App.js** to include new component
4. **Style in styles.css**

## 🐛 Debugging

### Backend Issues
```bash
cd backend
node server.js  # Run directly to see errors
```

### Frontend Issues
```bash
cd frontend
rm -rf .parcel-cache  # Clear cache
npm start
```

### Common Issues
1. **Port already in use**: Change PORT in `.env`
2. **CORS errors**: Check API URL matches in frontend
3. **Dependencies issues**: Delete `node_modules` and run `npm install` again

## 📊 API Testing

Use these curl commands to test the API:

### Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Create Note
```bash
curl -X POST http://localhost:4000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"user":"testuser","title":"My Note","content":"Note content","tags":["work"]}'
```

### Get Notes
```bash
curl http://localhost:4000/api/notes?user=testuser
```

## 🔒 Security Best Practices

1. **Never commit `.env` files** (they're in .gitignore)
2. **Never commit `users.json` or `notes.json`** (sensitive data)
3. **Change default ports** in production
4. **Use HTTPS** in production
5. **Add rate limiting** for production use

## 📈 Performance Tips

1. **Lazy load components** for larger apps
2. **Memoize expensive calculations** with `useMemo`
3. **Debounce search input** for better performance
4. **Paginate notes** if you have many notes
5. **Add caching** for API responses

## 🚀 Deployment

### Backend (Example with Heroku)
```bash
cd backend
heroku create mynotespace-api
git push heroku main
```

### Frontend (Example with Netlify)
```bash
cd frontend
npm run build
netlify deploy --prod
```

Update `REACT_APP_API_URL` to point to your deployed backend.

## 📝 Adding New API Endpoints

Example: Add a "favorite" feature
```javascript
// In backend/server.js
app.post('/api/notes/:id/favorite', (req, res) => {
  const id = req.params.id;
  let notes = readJSON(NOTES_FILE);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  notes[idx].favorite = !notes[idx].favorite;
  writeJSON(NOTES_FILE, notes);
  res.json(notes[idx]);
});
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register new user
- [ ] Login with user
- [ ] Create note
- [ ] Add tags to note
- [ ] Edit note
- [ ] Delete note
- [ ] Search notes
- [ ] Filter by tags
- [ ] Share note with another user
- [ ] Logout and login again

## 💡 Tips & Tricks

1. **Use React DevTools** to inspect component state
2. **Check Network tab** for API call debugging
3. **Console.log** liberally during development
4. **Use browser's localStorage inspector** to see saved data
5. **Keep backend terminal visible** to see API logs

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [SimpleMDE Editor](https://github.com/sparksuite/simplemde-markdown-editor)
- [React Markdown](https://github.com/remarkjs/react-markdown)

## 🆘 Getting Help

If you encounter issues:
1. Check the terminal for error messages
2. Check browser console for frontend errors
3. Review the API endpoint in backend/server.js
4. Check that all dependencies are installed
5. Ensure both servers are running

---

Happy coding! 🎉
