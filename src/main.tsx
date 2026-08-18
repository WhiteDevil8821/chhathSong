import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import { PresenceProvider } from './context/PresenceContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <PresenceProvider>
        <App />
      </PresenceProvider>
    </LanguageProvider>
  </StrictMode>,
);

