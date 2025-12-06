// src/pages/Reuniones.tsx
import { useEffect, useState } from "react";
import { getReuniones } from "../services/api";
import { Meeting } from "../types";
import "../components/Reuniones.css";
// ajusta la ruta según dónde esté el archivo

const Reuniones: React.FC = () => {
  const [reuniones, setReuniones] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReunion, setSelectedReunion] = useState<Meeting | null>(null);

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

  const contarAsistencia = (reunion: Meeting) => {
    const entries = Object.values(reunion.attendance ?? {});
    const presentes = entries.filter((a) => a.detected).length;
    const ausentes = entries.filter((a) => !a.detected).length;
    return { presentes, ausentes, total: entries.length };
  };

  const formatFecha = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const formatHora = (timeStr: string) => {
    // Si es "09:00" lo dejamos igual; si viene ISO, mostramos HH:MM
    if (timeStr.includes("T")) {
      const d = new Date(timeStr);
      return d.toLocaleTimeString("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return timeStr;
  };

  const formatTimestamp = (ts: string | null) => {
    if (!ts) return "No registrado";
    if (ts.includes("T")) {
      const d = new Date(ts);
      return d.toLocaleTimeString("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return ts;
  };

  // --- Bloques de asistencia para el modal ---
  const getPresentes = (reunion: Meeting) =>
    Object.entries(reunion.attendance ?? {}).filter(
      ([, data]) => data.detected
    );

  const getAusentes = (reunion: Meeting) =>
    Object.entries(reunion.attendance ?? {}).filter(
      ([, data]) => !data.detected
    );

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
            onClick={() => alert("Crear reunión (pendiente de implementar)")}
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
          <div className="empty-state mt-5">
            <div className="empty-icon">
              <i className="bi bi-calendar-x"></i>
            </div>
            <h4 className="empty-title">No hay reuniones registradas</h4>
            <p className="empty-description">
              Aún no se ha registrado ninguna reunión académica. Utiliza el
              botón <strong>"Nueva Reunión"</strong> para crear la primera.
            </p>
          </div>
        ) : (
          <div className="card shadow-sm mt-3 table-section">
            <div className="card-body table-container">
              {reuniones.map((r) => {
                const { presentes, ausentes } = contarAsistencia(r);
                return (
                  <div
                    key={r.id}
                    className="d-flex justify-content-between align-items-center py-3 border-bottom reunion-row"
                  >
                    {/* Fecha */}
                    <div className="fecha-col">
                      <div className="text-muted small">Fecha</div>
                      <div className="fw-semibold">
                        {formatFecha(r.date)}
                      </div>
                    </div>

                    {/* Tema */}
                    <div className="tema-col flex-grow-1 ms-3">
                      <div className="text-muted small">Tema</div>
                      <div className="fw-semibold">{r.title}</div>
                    </div>

                    {/* Horario */}
                    <div className="horario-col ms-3">
                      <div className="text-muted small">Horario</div>
                      <div className="fw-semibold">
                        {formatHora(r.start_time)} - {formatHora(r.end_time)}
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

                    {/* Estado + botón detalles */}
                    <div className="ms-3 d-flex align-items-center gap-2">
                      <span
                        className={`badge ${
                          r.active ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {r.active ? "Completada" : "Inactiva"}
                      </span>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        type="button"
                        onClick={() => setSelectedReunion(r)}
                      >
                        <i className="bi bi-eye me-1" />
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ==============================
          MODAL FICHA DE REUNIÓN
         ============================== */}
      {selectedReunion && (
        <>
          {/* Fondo oscuro */}
          <div
            className="modal-overlay"
            onClick={() => setSelectedReunion(null)}
          ></div>

          {/* Modal */}
          <div className="modal-ficha-reunion">
            {/* Header */}
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">
                <i className="bi bi-journal-text me-2"></i>
                Detalles de la Reunión
              </h5>
              <button
                className="btn-close-modal"
                type="button"
                onClick={() => setSelectedReunion(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body-custom">
              {/* Info principal */}
              <div className="reunion-info-header mb-4">
                <h3 className="reunion-tema">{selectedReunion.title}</h3>
                <div className="reunion-meta">
                  <div className="meta-item">
                    <i className="bi bi-calendar-event me-2" />
                    {formatFecha(selectedReunion.date)}
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-clock me-2" />
                    {formatHora(selectedReunion.start_time)} -{" "}
                    {formatHora(selectedReunion.end_time)}
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-geo-alt me-2" />
                    {selectedReunion.room}
                  </div>
                </div>
              </div>

              <div className="row g-4">
                {/* Imagen */}
                <div className="col-md-6">
                  <div className="imagen-section h-100">
                    <div className="section-title">
                      <i className="bi bi-camera me-2" />
                      Imagen Registrada por el Robot
                    </div>
                    <div className="imagen-container">
                      {selectedReunion.image_url ? (
                        <img
                          src={selectedReunion.image_url}
                          alt="Imagen de la reunión"
                          className="imagen-reunion"
                        />
                      ) : (
                        <div className="imagen-reunion d-flex align-items-center justify-content-center">
                          <span className="text-muted p-3">
                            No hay imagen registrada para esta reunión.
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="imagen-info">
                      {selectedReunion.image_url
                        ? "Capturada automáticamente"
                        : "Sin captura automática disponible"}
                    </div>
                  </div>
                </div>

                {/* Asistencia */}
                <div className="col-md-6">
                  {/* Resumen asistencia */}
                  <div className="resumen-asistencia mb-3">
                    <div className="section-title">
                      <i className="bi bi-people me-2" />
                      Resumen de Asistencia
                    </div>
                    {(() => {
                      const { presentes, ausentes, total } =
                        contarAsistencia(selectedReunion);
                      return (
                        <div className="resumen-cards">
                          <div className="resumen-card presente">
                            <div className="resumen-numero">{presentes}</div>
                            <div className="resumen-label">Presentes</div>
                          </div>
                          <div className="resumen-card ausente">
                            <div className="resumen-numero">{ausentes}</div>
                            <div className="resumen-label">Ausentes</div>
                          </div>
                          <div className="resumen-card total">
                            <div className="resumen-numero">{total}</div>
                            <div className="resumen-label">Total</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Listas de presentes y ausentes */}
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="asistencia-section h-100">
                        <div className="section-title">
                          <i className="bi bi-person-check me-2" />
                          Personas que Asistieron
                        </div>
                        <div className="personas-list">
                          {getPresentes(selectedReunion).length === 0 ? (
                            <p className="text-muted small">
                              No se registraron asistentes.
                            </p>
                          ) : (
                            getPresentes(selectedReunion).map(
                              ([userId, data], idx) => (
                                <div
                                  key={userId}
                                  className="persona-item presente-item"
                                >
                                  <div className="persona-icon">
                                    <i className="bi bi-check2" />
                                  </div>
                                  <div className="persona-info">
                                    <div className="persona-nombre">
                                      Asistente {idx + 1}
                                    </div>
                                    <div className="persona-detalle">
                                      Llegada:{" "}
                                      {formatTimestamp(data.timestamp)}
                                    </div>
                                  </div>
                                  <div className="persona-estado">
                                    <span className="badge bg-success">
                                      Presente
                                    </span>
                                  </div>
                                </div>
                              )
                            )
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="ausencia-section h-100">
                        <div className="section-title">
                          <i className="bi bi-person-x me-2" />
                          Personas que NO Asistieron
                        </div>
                        <div className="personas-list">
                          {getAusentes(selectedReunion).length === 0 ? (
                            <p className="text-muted small">
                              No hay ausencias registradas.
                            </p>
                          ) : (
                            getAusentes(selectedReunion).map(
                              ([userId], idx) => (
                                <div
                                  key={userId}
                                  className="persona-item ausente-item"
                                >
                                  <div className="persona-icon">
                                    <i className="bi bi-x" />
                                  </div>
                                  <div className="persona-info">
                                    <div className="persona-nombre">
                                      Invitado {idx + 1}
                                    </div>
                                    <div className="persona-detalle">
                                      No registrado
                                    </div>
                                  </div>
                                  <div className="persona-estado">
                                    <span className="badge bg-danger">
                                      Ausente
                                    </span>
                                  </div>
                                </div>
                              )
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="observaciones-section mt-4">
                <div className="section-title">
                  <i className="bi bi-chat-left-text me-2" />
                  Observaciones
                </div>
                <div className="observaciones-content">
                  {selectedReunion.observations && selectedReunion.observations.trim() !== ""
                    ? selectedReunion.observations
                    : "No se registraron observaciones para esta reunión."}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer-custom">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => setSelectedReunion(null)}
              >
                <i className="bi bi-x-circle me-1" />
                Cerrar
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => alert("Descargar reporte (pendiente)")}
              >
                <i className="bi bi-download me-1" />
                Descargar Reporte
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reuniones;
