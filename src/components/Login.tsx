import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.username, formData.password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1 className="login-title">Sistema Académico</h1>
          <p className="login-subtitle">ECOTEC</p>
        </div>

        <div className="login-body">
          {error && (
            <div className="alert-error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Usuario</label>
              <div className="input-group">
                <i className="bi bi-person-fill input-icon"></i>
                <input
                  type="text"
                  className="form-control-login with-icon"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Ingresa tu usuario"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className="input-group">
                <i className="bi bi-lock-fill input-icon"></i>
                <input
                  type="password"
                  className="form-control-login with-icon"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>
        </div>

        <div className="login-footer">
          <p className="login-footer-text">Sistema de Gestión Académica</p>
          <div className="universidad-badge">Universidad ECOTEC</div>
        </div>
      </div>
    </div>
  );
}
