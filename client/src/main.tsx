import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CityProvider } from './context/CityContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext.tsx';
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <CityProvider>
        <FavoritesProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </FavoritesProvider>
      </CityProvider>
    </ThemeProvider>
  </StrictMode>,
);
