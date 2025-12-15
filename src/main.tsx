import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAnalytics } from './services/analytics'

// Инициализация аналитики при старте приложения (async - не блокирует рендер)
initAnalytics().catch(error => {
  console.error('Analytics initialization failed:', error);
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
