import { useState } from "react";
import "./Reuniones.css";

// Datos de ejemplo de reuniones
const reunionesEjemplo = [
  {
    id: 1,
    tema: "Revisión de Proyectos de Titulación",
    fecha: "2024-01-15",
    horaInicio: "09:00",
    horaFin: "11:00",
    ubicacion: "Sala de Reuniones A-301",
    estado: "Completada",
    imagenRegistrada: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
    asistentes: [
      { nombre: "Luis Espinoza", estado: "Presente", horaLlegada: "09:05" },
      { nombre: "María González", estado: "Presente", horaLlegada: "09:00" },
      { nombre: "Carlos Ramírez", estado: "Presente", horaLlegada: "09:10" }
    ],
    ausentes: [
      { nombre: "Ana Martínez", motivo: "No registrado" },
      { nombre: "Pedro Sánchez", motivo: "No registrado" }
    ],
    observaciones: "Reunión finalizada exitosamente. Se revisaron 3 proyectos de titulación."
  }
];

export default function Reuniones() {
  const [reuniones] = useState(reunionesEjemplo);
  const [reunionSeleccionada, setReunionSeleccionada] = useState<any>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const abrirFichaReunion = (reunion: any) => {
    setReunionSeleccionada(reunion);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setReunionSeleccionada(null);
  };

  const formatearFecha = (fecha: string) => {
    const opciones: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(fecha).toLocaleDateString('es-ES', opciones);
  };

  return (
    <div className="reuniones-container">
      <div className="container-fluid px-4 py-4">
        {/* Header */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="page-title">
                <i className="bi bi-calendar-event-fill me-2"></i>
                Gestión de Reuniones
              </h2>
              <p className="page-subtitle">
                Registro y seguimiento de reuniones académicas
              </p>
            </div>
            <button className="btn btn-add-reunion">
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Reunión
            </button>
          </div>
        </div>

        {/* Tabla de Reuniones */}
        <div className="table-section">
          <div className="table-container shadow-sm">
            {reuniones.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover reuniones-table mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tema</th>
                      <th>Horario</th>
                      <th>Ubicación</th>
                      <th>Asistencia</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reuniones.map((reunion) => (
                      <tr key={reunion.id} onClick={() => abrirFichaReunion(reunion)}>
                        <td className="fecha-col">
                          <i className="bi bi-calendar3 me-2"></i>
                          {formatearFecha(reunion.fecha)}
                        </td>
                        <td className="tema-col">{reunion.tema}</td>
                        <td className="horario-col">
                          <i className="bi bi-clock me-1"></i>
                          {reunion.horaInicio} - {reunion.horaFin}
                        </td>
                        <td className="ubicacion-col">
                          <i className="bi bi-geo-alt-fill me-1"></i>
                          {reunion.ubicacion}
                        </td>
                        <td className="asistencia-col">
                          <span className="badge bg-success me-1">{reunion.asistentes.length} presentes</span>
                          <span className="badge bg-danger">{reunion.ausentes.length} ausentes</span>
                        </td>
                        <td className="estado-col">
                          <span className={`badge estado-badge ${reunion.estado === 'Completada' ? 'bg-success' : 'bg-warning'}`}>
                            {reunion.estado}
                          </span>
                        </td>
                        <td className="acciones-col">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              abrirFichaReunion(reunion);
                            }}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Ver Detalles
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
                  Comienza creando una nueva reunión.
                </p>
                <button className="btn btn-primary mt-3">
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Primera Reunión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - Ficha de la Reunión */}
      {mostrarModal && reunionSeleccionada && (
        <>
          <div className="modal-overlay" onClick={cerrarModal}></div>
          <div className="modal-ficha-reunion">
            <div className="modal-header-custom">
              <h4 className="modal-title-custom">
                <i className="bi bi-file-text-fill me-2"></i>
                Detalles de la Reunión
              </h4>
              <button className="btn-close-modal" onClick={cerrarModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Información General */}
              <div className="reunion-info-header mb-4">
                <h3 className="reunion-tema">{reunionSeleccionada.tema}</h3>
                <div className="reunion-meta">
                  <span className="meta-item">
                    <i className="bi bi-calendar-check me-2"></i>
                    {formatearFecha(reunionSeleccionada.fecha)}
                  </span>
                  <span className="meta-item">
                    <i className="bi bi-clock-fill me-2"></i>
                    {reunionSeleccionada.horaInicio} - {reunionSeleccionada.horaFin}
                  </span>
                  <span className="meta-item">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {reunionSeleccionada.ubicacion}
                  </span>
                </div>
              </div>

              <div className="row">
                {/* Columna Izquierda - Imagen */}
                <div className="col-md-5 mb-4">
                  <div className="imagen-section">
                    <h5 className="section-title">
                      <i className="bi bi-camera-fill me-2"></i>
                      Imagen Registrada por el Robot
                    </h5>
                    <div className="imagen-container">
                      <img 
                        src={reunionSeleccionada.imagenRegistrada} 
                        alt="Reunión registrada"
                        className="imagen-reunion"
                      />
                      <div className="imagen-info">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Capturada automáticamente
                      </div>
                    </div>
                  </div>

                  {/* Resumen de Asistencia */}
                  <div className="resumen-asistencia mt-4">
                    <h5 className="section-title">
                      <i className="bi bi-pie-chart-fill me-2"></i>
                      Resumen de Asistencia
                    </h5>
                    <div className="resumen-cards">
                      <div className="resumen-card presente">
                        <div className="resumen-numero">{reunionSeleccionada.asistentes.length}</div>
                        <div className="resumen-label">Presentes</div>
                      </div>
                      <div className="resumen-card ausente">
                        <div className="resumen-numero">{reunionSeleccionada.ausentes.length}</div>
                        <div className="resumen-label">Ausentes</div>
                      </div>
                      <div className="resumen-card total">
                        <div className="resumen-numero">
                          {reunionSeleccionada.asistentes.length + reunionSeleccionada.ausentes.length}
                        </div>
                        <div className="resumen-label">Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha - Listas */}
                <div className="col-md-7">
                  {/* Lista de Asistentes */}
                  <div className="asistencia-section mb-4">
                    <h5 className="section-title">
                      <i className="bi bi-person-check-fill me-2"></i>
                      Personas que Asistieron
                      <span className="badge bg-success ms-2">{reunionSeleccionada.asistentes.length}</span>
                    </h5>
                    <div className="personas-list">
                      {reunionSeleccionada.asistentes.map((persona: any, index: number) => (
                        <div key={index} className="persona-item presente-item">
                          <div className="persona-icon">
                            <i className="bi bi-check-circle-fill"></i>
                          </div>
                          <div className="persona-info">
                            <div className="persona-nombre">{persona.nombre}</div>
                            <div className="persona-detalle">
                              <i className="bi bi-clock me-1"></i>
                              Llegada: {persona.horaLlegada}
                            </div>
                          </div>
                          <div className="persona-estado">
                            <span className="badge bg-success">Presente</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lista de Ausentes */}
                  <div className="ausencia-section">
                    <h5 className="section-title">
                      <i className="bi bi-person-x-fill me-2"></i>
                      Personas que NO Asistieron
                      <span className="badge bg-danger ms-2">{reunionSeleccionada.ausentes.length}</span>
                    </h5>
                    <div className="personas-list">
                      {reunionSeleccionada.ausentes.map((persona: any, index: number) => (
                        <div key={index} className="persona-item ausente-item">
                          <div className="persona-icon">
                            <i className="bi bi-x-circle-fill"></i>
                          </div>
                          <div className="persona-info">
                            <div className="persona-nombre">{persona.nombre}</div>
                            <div className="persona-detalle">
                              <i className="bi bi-info-circle me-1"></i>
                              {persona.motivo}
                            </div>
                          </div>
                          <div className="persona-estado">
                            <span className="badge bg-danger">Ausente</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Observaciones */}
                  {reunionSeleccionada.observaciones && (
                    <div className="observaciones-section mt-4">
                      <h5 className="section-title">
                        <i className="bi bi-chat-left-text-fill me-2"></i>
                        Observaciones
                      </h5>
                      <div className="observaciones-content">
                        {reunionSeleccionada.observaciones}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button className="btn btn-secondary" onClick={cerrarModal}>
                <i className="bi bi-x-circle me-2"></i>
                Cerrar
              </button>
              <button className="btn btn-primary">
                <i className="bi bi-download me-2"></i>
                Descargar Reporte
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}