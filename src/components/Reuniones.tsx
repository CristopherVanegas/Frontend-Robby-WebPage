// src/components/Reuniones.tsx

import { useEffect, useState } from "react";
import { getReuniones } from "../services/api";
import { Meeting, AttendanceEntry } from "../types";

const formatFecha = (isoDate?: string) => {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  return d.toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatHora = (time?: string) => {
  if (!time) return "--:--";
  // soporta "HH:MM" o "HH:MM:SS"
  const [h = "00", m = "00"] = time.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
};

const getAttendanceStats = (meeting: Meeting) => {
  const entries = Object.values(meeting.attendance || {}) as AttendanceEntry[];
  const presentes = entries.filter((a) => a.detected).length;
  const ausentes = entries.filter((a) => !a.detected).length;
  const total = presentes + ausentes;
  return { presentes, ausentes, total };
};

const Reuniones = () => {
  const [reuniones, setReuniones] = useState<Meeting[]>([]);
  const [selected, setSelected] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchReuniones = async () => {
    try {
      setLoading(true);
      const data = await getReuniones();
      setReuniones(data);
    } catch (err) {
      console.error("Error obteniendo reuniones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReuniones();
  }, []);

  const handleRowClick = (reunion: Meeting) => {
    setSelected(reunion);
  };

  const handleCloseModal = () => setSelected(null);

  return (
    <div className="reuniones-container py-4">
      <div className="container">
        {/* HEADER */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="page-title">
                <i className="bi bi-calendar-week me-2" />
                Gestión de Reuniones
              </h2>
              <p className="page-subtitle">
                Registro y seguimiento de reuniones académicas
              </p>
            </div>

            {/* Botón de nueva reunión (por ahora solo decorativo) */}
            <button
              type="button"
              className="btn-add-reunion d-flex align-items-center"
              onClick={() => alert("Aquí luego abrimos el formulario de nueva reunión")}
            >
              <i className="bi bi-plus-circle me-2" />
              Nueva Reunión
            </button>
          </div>
        </div>

        {/* TABLA / LISTADO */}
        <section className="table-section">
          <div className="table-container shadow-sm">
            {loading && <p>Cargando reuniones...</p>}

            {!loading && reuniones.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <i className="bi bi-calendar-x" />
                </div>
                <h4 className="empty-title">No hay reuniones registradas</h4>
                <p className="empty-description">
                  Cuando el robot registre reuniones académicas, aparecerán aquí
                  para que puedas revisar su asistencia y detalles.
                </p>
              </div>
            )}

            {!loading && reuniones.length > 0 && (
              <div className="table-responsive">
                <table className="table reuniones-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Tema / Título</th>
                      <th>Horario</th>
                      <th>Ubicación</th>
                      <th>Asistencia</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {reuniones.map((r) => {
                      const { presentes, ausentes } = getAttendanceStats(r);
                      return (
                        <tr key={r.id} onClick={() => handleRowClick(r)}>
                          <td className="fecha-col">
                            <i className="bi bi-calendar-event me-2" />
                            {formatFecha(r.date)}
                          </td>
                          <td className="tema-col">{r.title}</td>
                          <td className="horario-col">
                            <i className="bi bi-clock me-2" />
                            {formatHora(r.start_time)} - {formatHora(r.end_time)}
                          </td>
                          <td className="ubicacion-col">
                            <i className="bi bi-geo-alt me-2" />
                            {r.room || "—"}
                          </td>
                          <td>
                            <span className="badge rounded-pill bg-success me-2">
                              {presentes} presentes
                            </span>
                            <span className="badge rounded-pill bg-danger">
                              {ausentes} ausentes
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill ${
                                r.active ? "bg-success" : "bg-secondary"
                              }`}
                            >
                              {r.active ? "Completada" : "Inactiva"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRowClick(r);
                              }}
                            >
                              <i className="bi bi-eye me-1" />
                              Ver Detalles
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* MODAL DE DETALLE */}
      {selected && (
        <>
          <div className="modal-overlay" onClick={handleCloseModal} />
          <div
            className="modal-ficha-reunion"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-custom">
              <h5 className="modal-title-custom">
                <i className="bi bi-journal-text me-2" />
                Detalles de la Reunión
              </h5>
              <button
                type="button"
                className="btn-close-modal"
                onClick={handleCloseModal}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>

            <div className="modal-body-custom">
              {/* Encabezado reunión */}
              <div className="reunion-info-header mb-4">
                <h3 className="reunion-tema">{selected.title}</h3>
                <p className="mb-2 text-muted">{selected.description}</p>
                <div className="reunion-meta">
                  <div className="meta-item">
                    <i className="bi bi-calendar-week me-2" />
                    {formatFecha(selected.date)}
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-clock me-2" />
                    {formatHora(selected.start_time)} -{" "}
                    {formatHora(selected.end_time)}
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-geo-alt me-2" />
                    {selected.room || "Sin sala asignada"}
                  </div>
                </div>
              </div>

              {/* Contenido principal */}
              <div className="row g-4">
                {/* Imagen */}
                <div className="col-lg-6">
                  <div className="imagen-section">
                    <div className="section-title mb-2">
                      <i className="bi bi-camera-fill me-2" />
                      Imagen Registrada por el Robot
                    </div>
                    <div className="imagen-container mb-2">
                      <img
                        src={
                          selected.image_url ||
                          "https://via.placeholder.com/600x300?text=Sin+imagen+registrada"
                        }
                        alt="Imagen de la reunión"
                        className="imagen-reunion"
                      />
                    </div>
                    <div className="imagen-info">
                      {selected.image_url
                        ? "Capturada automáticamente durante la reunión."
                        : "Aún no se ha registrado una imagen para esta reunión."}
                    </div>
                  </div>
                </div>

                {/* Personas + resumen */}
                <div className="col-lg-6">
                  {/* Resumen asistencia */}
                  <div className="resumen-asistencia mb-3">
                    <div className="section-title mb-3">
                      <i className="bi bi-pie-chart-fill me-2" />
                      Resumen de Asistencia
                    </div>
                    {(() => {
                      const entries = Object.entries(
                        selected.attendance || {}
                      ) as [string, AttendanceEntry][];
                      const presentes = entries.filter(
                        ([, a]) => a.detected
                      );
                      const ausentes = entries.filter(
                        ([, a]) => !a.detected
                      );
                      const total = presentes.length + ausentes.length;

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
                            <div className="resumen-numero">{total}</div>
                            <div className="resumen-label">Total</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Listas de personas */}
                  {(() => {
                    const entries = Object.entries(
                      selected.attendance || {}
                    ) as [string, AttendanceEntry][];
                    const presentes = entries.filter(
                      ([, a]) => a.detected
                    );
                    const ausentes = entries.filter(
                      ([, a]) => !a.detected
                    );

                    return (
                      <>
                        <div className="asistencia-section mb-3">
                          <div className="section-title mb-3">
                            <i className="bi bi-people-fill me-2" />
                            Personas que Asistieron{" "}
                            <span className="badge bg-success ms-1">
                              {presentes.length}
                            </span>
                          </div>
                          <div className="personas-list">
                            {presentes.map(([userId, info]) => (
                              <div
                                key={userId}
                                className="persona-item presente-item"
                              >
                                <div className="persona-icon">
                                  <i className="bi bi-check2-circle" />
                                </div>
                                <div className="persona-info">
                                  <div className="persona-nombre">
                                    {info.name || userId}
                                  </div>
                                  <div className="persona-detalle">
                                    Llegada:{" "}
                                    {info.timestamp
                                      ? new Date(
                                          info.timestamp
                                        ).toLocaleTimeString("es-EC", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "Registrado"}
                                  </div>
                                </div>
                                <div className="persona-estado">
                                  <span className="badge bg-success">
                                    Presente
                                  </span>
                                </div>
                              </div>
                            ))}
                            {presentes.length === 0 && (
                              <p className="text-muted mb-0">
                                No hay presentes registrados.
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="ausencia-section mb-3">
                          <div className="section-title mb-3">
                            <i className="bi bi-person-x-fill me-2" />
                            Personas que NO Asistieron{" "}
                            <span className="badge bg-danger ms-1">
                              {ausentes.length}
                            </span>
                          </div>
                          <div className="personas-list">
                            {ausentes.map(([userId, info]) => (
                              <div
                                key={userId}
                                className="persona-item ausente-item"
                              >
                                <div className="persona-icon">
                                  <i className="bi bi-x-circle" />
                                </div>
                                <div className="persona-info">
                                  <div className="persona-nombre">
                                    {info.name || userId}
                                  </div>
                                  <div className="persona-detalle">
                                    No registrado por el sistema
                                  </div>
                                </div>
                                <div className="persona-estado">
                                  <span className="badge bg-danger">
                                    Ausente
                                  </span>
                                </div>
                              </div>
                            ))}
                            {ausentes.length === 0 && (
                              <p className="text-muted mb-0">
                                No hay ausentes registrados.
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Observaciones */}
              <div className="observaciones-section mt-3">
                <div className="section-title mb-2">
                  <i className="bi bi-chat-left-text-fill me-2" />
                  Observaciones
                </div>
                <div className="observaciones-content">
                  {selected.observations && selected.observations.trim() !== ""
                    ? selected.observations
                    : "No se registraron observaciones adicionales para esta reunión."}
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button
                className="btn btn-outline-secondary"
                onClick={handleCloseModal}
              >
                Cerrar
              </button>
              <button
                className="btn btn-primary"
                onClick={() =>
                  alert("Aquí luego generamos/descargamos el reporte en PDF")
                }
              >
                <i className="bi bi-download me-2" />
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
