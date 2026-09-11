import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import Home from './pages/Home';
import Events from './pages/Events';
import Favorites from './pages/Favorites';
import Rights from './pages/Rights';
import Login from './pages/Login';
import Register from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

function EventDetails() {
  return <h1>Event details</h1>;
}

function Profile() {
  return <h1>Profile</h1>;
}

const AppContent = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  return (
    <div className="app">
      {!isAuthPage && <Header />}

      <main className="app__content">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/events"
            element={<Events />}
          />

          <Route
            path="/favorites"
            element={<Favorites />}
          />

          <Route
            path="/events/:id"
            element={<EventDetails />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/profile"
              element={<Profile />}
            />
          </Route>

          <Route
            path="/rights"
            element={<Rights />}
          />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;