import "./Home.css";

export default function Home() {
  // Simulación de datos - más adelante vendrá del backend
  const reuniones: any[] = []; // Array vacío por ahora

  return (
    <div className="home-container">
      <div className="container-fluid px-4 py-4">
        {/* Bienvenida */}
        <div className="welcome-section mb-4">
          <div className="welcome-card shadow-sm p-4">
            <div className="d-flex align-items-center">
              <div className="welcome-icon me-3">
                <i className="bi bi-person-circle"></i>
              </div>
              <div>
                <h2 className="welcome-title mb-2">¡Bienvenido al Sistema de Gestión ECOTEC!</h2>
                <p className="welcome-subtitle mb-0">
                  Administra profesores, reuniones y mantén un control eficiente de todas las actividades académicas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de últimas reuniones */}
        <div className="meetings-section">
          <div className="section-header mb-3">
            <h4 className="section-title">
              <i className="bi bi-calendar-check me-2"></i>
              Últimas Reuniones Registradas
            </h4>
          </div>

          <div className="table-container shadow-sm">
            {reuniones.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover meetings-table mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Profesor</th>
                      <th>Asunto</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reuniones.map((reunion, index) => (
                      <tr key={index}>
                        <td>{reunion.fecha}</td>
                        <td>{reunion.hora}</td>
                        <td>{reunion.profesor}</td>
                        <td>{reunion.asunto}</td>
                        <td>
                          <span className={`badge bg-${reunion.estado === 'Completada' ? 'success' : 'warning'}`}>
                            {reunion.estado}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary">
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="bi bi-calendar-x"></i>
                </div>
                <h5 className="empty-title">No hay reuniones registradas</h5>
                <p className="empty-description">
                  Aún no se han programado reuniones en el sistema. 
                  <br />
                  Comienza agregando una nueva reunión desde el módulo de Reuniones.
                </p>
                <a href="/reuniones" className="btn btn-primary mt-3">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nueva Reunión
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}