import { useEffect, useState } from "react";
import { getReuniones } from "../services/api";
import { Meeting } from "../types";

const Reuniones: React.FC = () => {
  const [reuniones, setReuniones] = useState<Meeting[]>([]);
  const [reunionSeleccionada, setReunionSeleccionada] = useState<Meeting | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReuniones = async () => {
    try {
      setLoading(true);
      const data = await getReuniones();
      console.log("Reuniones desde API:", data);
      setReuniones(data);
    } catch (error) {
      console.error("Error obteniendo reuniones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReuniones();
  }, []);

  const abrirModal = (reunion: Meeting) => {
    setReunionSeleccionada(reunion);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setReunionSeleccionada(null);
  };

  const contarAsistencia = (reunion: Meeting) => {
    const entries = Object.values(reunion.attendance ?? {});
    const presentes = entries.filter((a: any) => a.detected).length;
    const ausentes = entries.filter((a: any) => !a.detected).length;
    return {
      presentes,
      ausentes,
      total: entries.length,
    };
  };

  return (
    <div className="reuniones-container py-4">
      <div className="container">
        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start page-header mb-4">
          <div>
            <h2 className="page-title d-flex align-items-center">
              <i className="bi bi-calendar-event me-2"></i>
              Gestión de Reuniones
            </h2>
            <p className="page-subtitle">
              Registro y seguimiento de reuniones académicas
            </p>
          </div>

          <button
            className="btn btn-add-reunion d-flex align-items-center"
            type="button"
            onClick={() => alert("Crear reunión: pendiente de implementar")}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Nueva Reunión
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando reuniones...</p>
          </div>
        ) : reuniones.length === 0 ? (
          // ESTADO VACÍO (NO HAY REUNIONES EN BD)
          <div className="empty-state mt-5">
            <div className="empty-icon">
              <i className="bi bi-calendar-x"></i>
            </div>
            <h4 className="empty-title">No hay reuniones registradas</h4>
            <p className="empty-description">
              Aún no se ha registrado ninguna reunión académica.
              Utiliza el botón <strong>"Nueva Reunión"</strong> para crear la primera.
            </p>
          </div>
        ) : (
          // LISTA DE REUNIONES (TODO VIENE DESDE LA BD)
          <div className="card shadow-sm mt-3 table-section">
            <div className="card-body table-container">
              {reuniones.map((r) => {
                const { presentes, ausentes } = contarAsistencia(r);

                return (
                  <div
                    key={r.id}
                    className="d-flex justify-content-between align-items-center py-3 border-bottom reunion-row"
                    onClick={() => abrirModal(r)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Fecha */}
                    <div className="fecha-col">
                      <div className="text-muted small">Fecha</div>
                      <div className="fw-semibold">
                        {new Date(r.date).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Tema / Título */}
                    <div className="tema-col flex-grow-1 ms-3">
                      <div className="text-muted small">Tema</div>
                      <div className="fw-semibold">{r.title}</div>
                    </div>

                    {/* Horario */}
                    <div className="horario-col ms-3">
                      <div className="text-muted small">Horario</div>
                      <div className="fw-semibold">
                        {r.start_time} - {r.end_time}
                      </div>
                    </div>

                    {/* Ubicación */}
                    <div className="ubicacion-col ms-3">
                      <div className="text-muted small">Ubicación</div>
                      <div className="fw-semibold">{r.room}</div>
                    </div>

                    {/* Resumen asistencia */}
                    <div className="ms-3 d-flex align-items-center gap-2">
                      <span className="badge bg-success">
                        {presentes} presentes
                      </span>
                      <span className="badge bg-danger">
                        {ausentes} ausentes
                      </span>
                    </div>

                    {/* Estado de la reunión */}
                    <div className="ms-3">
                      <span
                        className={`badge ${
                          r.active ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {r.active ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                    {/* Botón Ver Detalles */}
                    <div className="ms-3">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); // que no dispare el onClick de la fila
                          abrirModal(r);
                        }}
                      >
                        <i className="bi bi-eye me-1"></i>
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL DE DETALLES DE LA REUNIÓN */}
        {showModal && reunionSeleccionada && (
          <>
            <div className="modal-overlay" onClick={cerrarModal} />
            <div className="modal-ficha-reunion">
              {/* Header del modal */}
              <div className="modal-header-custom">
                <h5 className="modal-title-custom">
                  <i className="bi bi-journal-text me-2"></i>
                  {reunionSeleccionada.title}
                </h5>
                <button
                  type="button"
                  className="btn-close-modal"
                  onClick={cerrarModal}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Body del modal */}
              <div className="modal-body-custom">
                {/* Info general de la reunión */}
                <div className="reunion-info-header mb-4">
                  <div className="reunion-tema">
                    {reunionSeleccionada.title}
                  </div>
                  <p className="mb-3 text-muted">
                    {reunionSeleccionada.description || "Sin descripción."}
                  </p>
                  <div className="reunion-meta">
                    <div className="meta-item">
                      <i className="bi bi-calendar3 me-2"></i>
                      {new Date(reunionSeleccionada.date).toLocaleDateString(
                        "es-EC",
                        { day: "2-digit", month: "long", year: "numeric" }
                      )}
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-clock me-2"></i>
                      {reunionSeleccionada.start_time} -{" "}
                      {reunionSeleccionada.end_time}
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-geo-alt me-2"></i>
                      {reunionSeleccionada.room}
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Imagen de la reunión */}
                  <div className="col-md-6">
                    <div className="imagen-section">
                      <div className="section-title">
                        <i className="bi bi-camera me-2"></i>
                        Imagen Registrada por el Robot
                      </div>
                      <div className="imagen-container">
                        <img
                          className="imagen-reunion"
                          src={
                            reunionSeleccionada.image_url ||
                            "https://via.placeholder.com/800x400?text=Sin+imagen+registrada"
                          }
                          alt="Imagen de la reunión"
                        />
                      </div>
                      <div className="imagen-info">
                        {reunionSeleccionada.image_url
                          ? "Capturada automáticamente"
                          : "Sin imagen disponible"}
                      </div>
                    </div>
                  </div>

                  {/* Resumen y listas de asistencia */}
                  <div className="col-md-6">
                    {/* Resumen asistencia */}
                    <div className="resumen-asistencia mb-4">
                      <div className="section-title">
                        <i className="bi bi-people me-2"></i>
                        Resumen de Asistencia
                      </div>
                      {(() => {
                        const entries = Object.entries(
                          reunionSeleccionada.attendance ?? {}
                        );
                        const presentes = entries.filter(
                          ([, a]: any) => a.detected
                        );
                        const ausentes = entries.filter(
                          ([, a]: any) => !a.detected
                        );

                        return (
                          <div className="resumen-cards">
                            <div className="resumen-card presente">
                              <div className="resumen-numero">
                                {presentes.length}
                              </div>
                              <div className="resumen-label">Presentes</div>
                            </div>
                            <div className="resumen-card ausente">
                              <div className="resumen-numero">
                                {ausentes.length}
                              </div>
                              <div className="resumen-label">Ausentes</div>
                            </div>
                            <div className="resumen-card total">
                              <div className="resumen-numero">
                                {entries.length}
                              </div>
                              <div className="resumen-label">Total</div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Listas de personas */}
                    {(() => {
                      const entries = Object.entries(
                        reunionSeleccionada.attendance ?? {}
                      );
                      const presentes = entries.filter(
                        ([, a]: any) => a.detected
                      );
                      const ausentes = entries.filter(
                        ([, a]: any) => !a.detected
                      );

                      return (
                        <>
                          {/* Presentes */}
                          <div className="asistencia-section mb-4">
                            <div className="section-title">
                              <i className="bi bi-person-check me-2"></i>
                              Personas que Asistieron
                            </div>
                            {presentes.length === 0 ? (
                              <p className="text-muted mb-0">
                                No hay registros de personas presentes.
                              </p>
                            ) : (
                              <div className="personas-list">
                                {presentes.map(([userId, a]: any, idx) => (
                                  <div
                                    key={userId}
                                    className="persona-item presente-item"
                                  >
                                    <div className="persona-icon">
                                      <i className="bi bi-check-circle"></i>
                                    </div>
                                    <div className="persona-info">
                                      <div className="persona-nombre">
                                        Participante {idx + 1}
                                      </div>
                                      <div className="persona-detalle">
                                        ID: {userId} · Llegada:{" "}
                                        {a.timestamp || "No registrada"}
                                      </div>
                                    </div>
                                    <div className="persona-estado">
                                      <span className="badge bg-success">
                                        Presente
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Ausentes */}
                          <div className="ausencia-section mb-4">
                            <div className="section-title">
                              <i className="bi bi-person-x me-2"></i>
                              Personas que NO Asistieron
                            </div>
                            {ausentes.length === 0 ? (
                              <p className="text-muted mb-0">
                                No hay registros de personas ausentes.
                              </p>
                            ) : (
                              <div className="personas-list">
                                {ausentes.map(([userId, a]: any, idx) => (
                                  <div
                                    key={userId}
                                    className="persona-item ausente-item"
                                  >
                                    <div className="persona-icon">
                                      <i className="bi bi-x-circle"></i>
                                    </div>
                                    <div className="persona-info">
                                      <div className="persona-nombre">
                                        Participante {idx + 1}
                                      </div>
                                      <div className="persona-detalle">
                                        ID: {userId} · No registrado
                                      </div>
                                    </div>
                                    <div className="persona-estado">
                                      <span className="badge bg-danger">
                                        Ausente
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Observaciones */}
                <div className="observaciones-section mt-3">
                  <div className="section-title">
                    <i className="bi bi-chat-square-text me-2"></i>
                    Observaciones
                  </div>
                  <div className="observaciones-content">
                    {reunionSeleccionada.observations ||
                      "Sin observaciones registradas para esta reunión."}
                  </div>
                </div>
              </div>

              {/* Footer del modal */}
              <div className="modal-footer-custom">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={cerrarModal}
                >
                  <i className="bi bi-x-lg me-2"></i>
                  Cerrar
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => alert("Descargar reporte: pendiente")}
                >
                  <i className="bi bi-download me-2"></i>
                  Descargar Reporte
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reuniones;

