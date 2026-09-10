import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CityProvider } from './context/CityContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import './styles/main.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <CityProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </CityProvider>
    </ThemeProvider>
  </StrictMode>,
);
