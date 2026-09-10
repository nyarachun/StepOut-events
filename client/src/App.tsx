import { HashRouter, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import Home from './pages/Home';
import Events from './pages/Events';
import Favorites from './pages/Favorites';
import Rights from './pages/Rights';

function EventDetails() {
  return <h1>Event details</h1>;
}

function Login() {
  return <h1>Login</h1>;
}

function Register() {
  return <h1>Register</h1>;
}

function Profile() {
  return <h1>Profile</h1>;
}

function App() {
  return (
    <HashRouter>
      <div className="app">
        <Header />

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
              element={<Profile />}
            />

            <Route 
              path="/rights"
              element={<Rights />}
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;