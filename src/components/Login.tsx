import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: any) => {
    e.preventDefault();

    // 🔥 LOGIN QUEMADO (sin backend)
    if (user === "admin" && password === "123") {
      // 🔥 Redirige correctamente al Home
      window.location.href = "/Home";
    } else {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-card card p-5 shadow-lg">
        {/* Logo ECOTEC */}
        <div className="text-center mb-4">
          <img 
            src="./assets/ecotec_logolargo.png" 
            alt="Logo ECOTEC" 
            className="logo-ecotec mb-3"
          />
          <h3 className="title-login">Iniciar Sesión</h3>
          <p className="subtitle-login">Accede a tu cuenta</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-modern" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="form-label label-modern">Usuario</label>
            <div className="input-group-modern">
              <span className="input-icon">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control modern-input"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label label-modern">Contraseña</label>
            <div className="input-group-modern">
              <span className="input-icon">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control modern-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn login-btn w-100 mt-3">
            <span className="btn-text">Entrar</span>
            <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;