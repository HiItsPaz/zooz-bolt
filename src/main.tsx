import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PWAProvider } from './components/pwa/PWAProvider';
import { ResponsiveProvider } from './components/responsive/ResponsiveProvider';

// Register service worker
if ('serviceWorker' in navigator) {
  registerSW();
}

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ResponsiveProvider>
            <PWAProvider>
              <App />
            </PWAProvider>
          </ResponsiveProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);