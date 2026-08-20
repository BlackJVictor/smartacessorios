import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccessibilityProvider>
      <App />
      <AccessibilityToolbar />
    </AccessibilityProvider>
  </StrictMode>,
);

