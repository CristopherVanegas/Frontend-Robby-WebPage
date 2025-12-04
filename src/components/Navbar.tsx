import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes agregar lógica adicional de logout si es necesario
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg ecotec-navbar shadow-sm px-4">
      <div className="container-fluid">
        {/* Logo ECOTEC */}
        <a className="navbar-brand d-flex align-items-center" href="/home">
          <img 
            src="./assets/ecotec_logolargo.png" 
            alt="Logo ECOTEC" 
            className="navbar-logo me-2"
          />
          <span className="brand-text text-white fw-bold d-none d-md-inline">
            Sistema de Gestión
          </span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link to="/home" className="nav-link text-white">
                <i className="bi bi-house-door-fill me-1"></i>
                Inicio
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/profesores" className="nav-link text-white">
                <i className="bi bi-person-badge-fill me-1"></i>
                Profesores
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/reuniones" className="nav-link text-white">
                <i className="bi bi-calendar-event-fill me-1"></i>
                Reuniones
              </Link>
            </li>

            <li className="nav-item ms-3">
              <button 
                onClick={handleLogout}
                className="btn btn-logout"
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}