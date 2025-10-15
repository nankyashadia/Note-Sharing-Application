# ✨ MyNoteSpace — Modern Note Sharing Application

**AIBOS Take-Home Assignment — Enhanced React + Node.js Application**

## 🎯 Overview
A beautiful, modern note-sharing application with enhanced user experience, featuring:
- 🔐 Secure authentication (register & login with password confirmation and bcrypt hashing)
- 📝 Rich markdown editor (SimpleMDE) with live preview
- 🏷️ Tag-based organization and filtering
- 📤 Share notes with other users
- 🔍 Advanced search functionality
- ⚡ Loading states and error handling
- 🎨 Smooth animations and transitions
- 📱 Fully responsive design
- 💾 Local JSON storage for data persistence

## 📁 Project Structure
```
note-sharing-app/
├── backend/                    # Node.js/Express API server
│   ├── server.js              # Main server file with all API endpoints
│   ├── package.json           # Backend dependencies
│   ├── users.json             # User data storage (auto-generated)
│   ├── notes.json             # Notes data storage (auto-generated)
│   ├── .env.example           # Environment variables template
│   └── .gitignore            # Git ignore rules
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── App.js            # Main app component with state management
│   │   ├── index.js          # React entry point
│   │   ├── index.html        # HTML template
│   │   ├── styles.css        # Enhanced CSS with animations
│   │   └── components/
│   │       ├── Login.js      # Authentication component
│   │       ├── NoteForm.js   # Create/edit notes with tags
│   │       └── NotesList.js  # Display, filter, and manage notes
│   ├── package.json          # Frontend dependencies
│   ├── .env.example          # Environment variables template
│   └── .gitignore           # Git ignore rules
│
└── README.md                  # This file
```

## 🚀 Quick Start (Local Development)

### Backend Setup
1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Start the backend server:
   ```bash
   npm start
   ```
   Backend runs on **http://localhost:4000**

### Frontend Setup
1. Navigate to frontend folder (in a new terminal):
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Create `.env` file from template:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   Parcel will open the app in your browser automatically

## ✨ Features

### 🔐 Authentication
- **Register**: Create new account with username and password
- **Password Confirmation**: Ensures password accuracy during registration
- **Secure Storage**: Passwords hashed with bcryptjs (10 salt rounds)
- **Login**: Authenticate with stored credentials
- **Session Persistence**: User session saved in localStorage

### 📝 Note Management
- **Create Notes**: Rich markdown editor with live formatting
- **Edit Notes**: Update title, content, and tags
- **Delete Notes**: Remove notes with confirmation dialog
- **Markdown Support**: Full markdown rendering with react-markdown
- **Auto-save timestamps**: Track creation and last update times

### 🏷️ Tags & Organization
- **Add Tags**: Categorize notes with custom tags
- **Tag Filtering**: Filter notes by specific tags
- **Tag Management**: Add/remove tags easily
- **Visual Tags**: Color-coded tag display

### 📤 Sharing & Collaboration
- **Share Notes**: Share your notes with other users
- **Shared Badge**: Visual indicator for shared notes
- **Read Access**: Shared users can view (but not edit) notes
- **User Selection**: Easy dropdown to select recipients

### 🔍 Search & Filter
- **Live Search**: Real-time search across titles and content
- **Tag Filters**: Quick filter by tags
- **Combined Filtering**: Search + tag filtering works together

### 🎨 User Experience
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: Fade-in, slide, and scale animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient backgrounds and card designs
- **Hover Effects**: Interactive feedback on all elements

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login existing user
- `GET /api/users` - List all users (for sharing)

### Notes
- `GET /api/notes?user={username}` - Get all notes for user (including shared)
- `GET /api/notes/user/:username` - Get notes by username
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/share` - Share note with user
- `DELETE /api/notes/:id/share/:username` - Unshare note

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **bcryptjs** - Password hashing
- **cors** - Cross-origin resource sharing
- **fs** - File system for JSON storage

### Frontend
- **React 18** - UI library
- **Parcel** - Build tool and dev server
- **SimpleMDE** - Markdown editor
- **react-markdown** - Markdown renderer
- **CSS3** - Modern styling with animations

## 📝 Data Storage
- **users.json**: Stores user accounts with hashed passwords
- **notes.json**: Stores all notes with metadata (tags, sharing info, timestamps)
- Files are auto-generated on first run
- Data persists between server restarts

## 🎯 Key Improvements Made

### Backend Enhancements
✅ Request logging middleware  
✅ Error handling middleware  
✅ Enhanced server startup banner  
✅ Tags support in notes  
✅ Note sharing functionality  
✅ Shared notes filtering  
✅ Better error responses  

### Frontend Enhancements
✅ Loading spinners and states  
✅ Error boundaries and messages  
✅ Tag creation and management  
✅ Tag-based filtering  
✅ Share notes modal  
✅ Shared notes indicators  
✅ Environment variable support  
✅ Smooth animations and transitions  
✅ Enhanced color scheme  
✅ Responsive design  
✅ Better form validation  
✅ Emoji icons for better UX  

### Code Organization
✅ Separate backend and frontend folders  
✅ Environment configuration files  
✅ Git ignore files for both folders  
✅ Clean component structure  
✅ Modular CSS with CSS variables  

## 🎨 Design Features
- **Modern Gradient Backgrounds**: Purple-themed gradients
- **Card-based Layout**: Clean, organized content cards
- **Smooth Transitions**: All interactions animated
- **Color-coded Elements**: Different colors for different actions
- **Responsive Grid**: Adapts to screen size
- **Glassmorphism Effects**: Backdrop blur on header
- **Micro-interactions**: Hover effects and button animations

## 📱 Responsive Design
The app is fully responsive and works beautifully on:
- 💻 Desktop (1200px+)
- 📱 Tablet (768px - 1199px)
- 📱 Mobile (< 768px)

## 🔒 Security Features
- Passwords hashed with bcryptjs (8 salt rounds)
- No plain-text password storage
- Input validation on both client and server
- XSS protection via react-markdown (skipHtml)
- CORS enabled for API security

## 🚦 Interview Talking Points
1. **Architecture**: Clean separation between backend and frontend
2. **State Management**: Efficient React state handling with hooks
3. **User Experience**: Loading states, error handling, smooth animations
4. **Features**: Tags, sharing, search - all enhance usability
5. **Security**: Password hashing, validation, secure API design
6. **Scalability**: Modular code structure, easy to add features
7. **Modern Stack**: Latest React, modern CSS, ES6+ JavaScript
8. **Responsive**: Mobile-first approach with breakpoints
9. **Performance**: Optimized re-renders, efficient filtering
10. **Code Quality**: Clean, readable, well-commented code

## 🎓 Future Enhancements (if more time)
- User profile avatars
- Note categories/folders
- Rich text editor with more features
- Dark mode toggle
- Export notes (PDF, Markdown)
- Real-time collaboration (WebSockets)
- Database integration (MongoDB/PostgreSQL)
- JWT authentication
- File attachments
- Note versioning/history

## 📄 License
This is a take-home assignment project for AIBOS.

---

**Built with ❤️ for AIBOS Take-Home Assignment**
