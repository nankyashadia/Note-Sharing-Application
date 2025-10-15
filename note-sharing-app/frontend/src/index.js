import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Silence known React 18 dev warning from react-markdown@8 about defaultProps
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const shouldSilence = (args) =>
  typeof args[0] === 'string' &&
  args[0].includes('Support for defaultProps will be removed from function components');

console.warn = (...args) => {
  if (shouldSilence(args)) return;
  originalConsoleWarn(...args);
};

console.error = (...args) => {
  if (shouldSilence(args)) return;
  originalConsoleError(...args);
};

createRoot(document.getElementById('root')).render(<App />)
