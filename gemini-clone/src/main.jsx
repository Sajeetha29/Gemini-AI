import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import App from './App.jsx';
import ContextProvider from './context/context.jsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ContextProvider>
        <App />
      </ContextProvider>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}