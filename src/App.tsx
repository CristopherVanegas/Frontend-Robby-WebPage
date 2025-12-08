import { useAuth, AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Profesores from './components/Profesores';
import Reuniones from './components/Reuniones';
import { useState } from 'react';
import './App.css';

function AppContent() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const [vistaActiva, setVistaActiva] = useState<'profesores' | 'reuniones'>('profesores');

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-ecotec">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <i className="bi bi-mortarboard-fill me-2"></i>
            Sistema Académico ECOTEC
          </a>
          <div className="navbar-nav ms-auto d-flex flex-row align-items-center">
            <button 
              className={`nav-link btn ${vistaActiva === 'profesores' ? 'active' : ''}`}
              onClick={() => setVistaActiva('profesores')}
            >
              <i className="bi bi-person-badge me-1"></i>
              Profesores
            </button>
            <button 
              className={`nav-link btn ${vistaActiva === 'reuniones' ? 'active' : ''}`}
              onClick={() => setVistaActiva('reuniones')}
            >
              <i className="bi bi-calendar-event me-1"></i>
              Reuniones
            </button>
            <div className="nav-divider"></div>
            <span className="nav-user">
              <i className="bi bi-person-circle me-1"></i>
              {user?.username}
            </span>
            <button className="btn-logout" onClick={logout}>
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido */}
      <main>
        {vistaActiva === 'profesores' ? <Profesores /> : <Reuniones />}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
