import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import Achievements from './pages/Achievements';
import Admin from './pages/Admin';
import Chats from './pages/Chats';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import EventDetails from './pages/EventDetails';
import EventRegistration from './pages/EventRegistration';
import Events from './pages/Events';
import Favorites from './pages/Favorites';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import MyEvents from './pages/MyEvents';
import MySquads from './pages/MySquads';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Rights from './pages/Rights';
import Squads from './pages/Squads';
import VerifyEmail from './pages/VerifyEmail';

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

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rights"
            element={<Rights />}
          />

          <Route
            path="/achievements"
            element={<Achievements />}
          />

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/events/:id/register"
            element={<EventRegistration />}
          />

          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/squads"
            element={
              <ProtectedRoute>
                <Squads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-squads"
            element={
              <ProtectedRoute>
                <MySquads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
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