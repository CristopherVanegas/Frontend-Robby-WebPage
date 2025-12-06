import { useEffect, useState } from "react";
import { getReuniones } from "../services/api";
import type { Reunion } from "../types";

// 👇 Ajusta la ruta según dónde tengas el CSS
import "../components/Reuniones.css";

const Reuniones = () => {
  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReunion, setSelectedReunion] = useState<Reunion | null>(null);

  // Cargar reuniones al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getReuniones();
        // Solo reuniones activas
        const activas = data.filter((r) => r.active);
        setReuniones(activas);
      } catch (error) {
        console.error("Error obteniendo reuniones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatFecha = (dateStr: string) => {
    if (!dateStr) return "";
    // Si ya viene "2024-01-14", esto lo vuelve "14/01/2024"
    const [y, m, d] = dateStr.split("-");
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}/${y}`;
  };

  const formatHora = (timeStr: string) => {
    if (!timeStr) return "";
    // Si viene "09:00:00" o "09:00"
    return timeStr.slice(0, 5);
  };

  const estadoBadgeClass = (active: boolean) =>
    active ? "badge bg-success" : "badge bg-secondary";

  const estadoTexto = (active: boolean) => (active ? "Activa" : "Inactiva");

  const getAttendanceStats = (attendance: Reunion["attendance"]) => {
    const values = Object.values(attendance || {});
    const total = values.length;
    const presentes = values.filter((a) => a.detected).length;
    const ausentes = total - presentes;
    return { total, presentes, ausentes };
  };

  const handleRowClick = (reunion: Reunion) => {
    setSelectedReunion(reunion);
  };

  const closeModal = () => {
    setSelectedReunion(null);
  };

  const renderTabla = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="text-center">
            Cargando reuniones...
          </td>
        </tr>
      );
    }

    if (!loading && reuniones.length === 0) {
      // No mostramos filas si no hay, dejamos que el “empty state” se encargue
      return null;
    }

    return reuniones.map((r) => (
      <tr key={r.id} onClick={() => handleRowClick(r)}>
        <td className="fecha-col">{formatFecha(r.date)}</td>
        <td className="horario-col">
          {formatHora(r.start_time)} - {formatHora(r.end_time)}
        </td>
        <td className="tema-col">{r.title}</td>
        <td className="ubicacion-col">{r.room || "—"}</td>
        <td>
          <span className={estadoBadgeClass(r.active)}>
            {estadoTexto(r.active)}
          </span>
        </td>
        <td className="text-center">
          <i className="bi bi-chevron-right"></i>
        </td>
      </tr>
    ));
  };

  const renderEmptyState = () => {
    if (loading) return null;
    if (reuniones.length > 0) return null;

    return (
      <div className="empty-state">
        <div className="empty-icon">
          <i className="bi bi-calendar-x"></i>
        </div>
        <h4 className="empty-title">No hay reuniones registradas</h4>
        <p className="empty-description">
          Cuando se creen nuevas reuniones, podr&aacute;s ver aqu&iacute; sus
          detalles, horarios y lista de asistencia.
        </p>
      </div>
    );
  };

  const renderModal = () => {
    if (!selectedReunion) return null;

    const { total, presentes, ausentes } = getAttendanceStats(
      selectedReunion.attendance || {}
    );
    const attendanceValues = Object.values(selectedReunion.attendance || {});

    return (
      <>
        {/* Fondo oscuro */}
        <div className="modal-overlay" onClick={closeModal}></div>

        {/* Modal principal */}
        <div className="modal-ficha-reunion">
          {/* Header */}
          <div className="modal-header-custom">
            <h5 className="modal-title-custom">
              <i className="bi bi-people me-2"></i>
              Detalles de la reuni&oacute;n
            </h5>
            <button className="btn-close-modal" onClick={closeModal}>
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
                  <i className="bi bi-calendar3 me-2"></i>
                  {formatFecha(selectedReunion.date)}
                </div>
                <div className="meta-item">
                  <i className="bi bi-clock me-2"></i>
                  {formatHora(selectedReunion.start_time)} -{" "}
                  {formatHora(selectedReunion.end_time)}
                </div>
                <div className="meta-item">
                  <i className="bi bi-geo-alt me-2"></i>
                  {selectedReunion.room || "Sin sala asignada"}
                </div>
                <div className="meta-item">
                  <span className={estadoBadgeClass(selectedReunion.active)}>
                    {estadoTexto(selectedReunion.active)}
                  </span>
                </div>
              </div>
            </div>

            <div className="row g-4">
              {/* Imagen */}
              <div className="col-md-6">
                <div className="imagen-section">
                  <h6 className="section-title">
                    <i className="bi bi-image me-2"></i>
                    Captura de asistencia
                  </h6>
                  <div className="imagen-container">
                    <img
                      className="imagen-reunion"
                      src={
                        selectedReunion.image_url ||
                        "https://via.placeholder.com/800x450?text=Sin+imagen"
                      }
                      alt="Imagen de la reunión"
                    />
                  </div>
                  <div className="imagen-info">
                    Imagen utilizada para el registro de asistencia autom&aacute;tica.
                  </div>
                </div>
              </div>

              {/* Resumen asistencia */}
              <div className="col-md-6">
                <div className="resumen-asistencia">
                  <h6 className="section-title">
                    <i className="bi bi-person-check me-2"></i>
                    Resumen de asistencia
                  </h6>
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
                      <div className="resumen-label">Total registrados</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Listas presentes / ausentes */}
              <div className="col-md-6">
                <div className="asistencia-section">
                  <h6 className="section-title">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    Personas presentes
                  </h6>
                  <div className="personas-list">
                    {attendanceValues.filter((a) => a.detected).length === 0 && (
                      <p className="text-muted mb-0">
                        No se registraron presentes.
                      </p>
                    )}
                    {attendanceValues
                      .filter((a) => a.detected)
                      .map((a, index) => (
                        <div
                          className="persona-item presente-item"
                          key={`presente-${index}`}
                        >
                          <div className="persona-icon">
                            <i className="bi bi-person-check-fill"></i>
                          </div>
                          <div className="persona-info">
                            <div className="persona-nombre">
                              Asistente {index + 1}
                            </div>
                            <div className="persona-detalle">
                              Detectado a las{" "}
                              {a.timestamp
                                ? new Date(a.timestamp).toLocaleTimeString(
                                    "es-EC",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : "Hora no registrada"}
                            </div>
                          </div>
                          <div className="persona-estado">
                            <span className="badge bg-success">Presente</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="ausencia-section">
                  <h6 className="section-title">
                    <i className="bi bi-person-x-fill me-2"></i>
                    Personas ausentes
                  </h6>
                  <div className="personas-list">
                    {attendanceValues.filter((a) => !a.detected).length ===
                      0 && (
                      <p className="text-muted mb-0">
                        No se registraron ausentes.
                      </p>
                    )}
                    {attendanceValues
                      .filter((a) => !a.detected)
                      .map((_, index) => (
                        <div
                          className="persona-item ausente-item"
                          key={`ausente-${index}`}
                        >
                          <div className="persona-icon">
                            <i className="bi bi-person-x-fill"></i>
                          </div>
                          <div className="persona-info">
                            <div className="persona-nombre">
                              Asistente {index + 1}
                            </div>
                            <div className="persona-detalle">
                              No fue detectado por el sistema.
                            </div>
                          </div>
                          <div className="persona-estado">
                            <span className="badge bg-danger">Ausente</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Observaciones */}
              <div className="col-12">
                <div className="observaciones-section">
                  <h6 className="section-title">
                    <i className="bi bi-card-text me-2"></i>
                    Observaciones
                  </h6>
                  <div className="observaciones-content">
                    {selectedReunion.observations &&
                    selectedReunion.observations.trim() !== ""
                      ? selectedReunion.observations
                      : "No se registraron observaciones adicionales para esta reunión."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer-custom">
            <button className="btn btn-outline-secondary" onClick={closeModal}>
              Cerrar
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="reuniones-container">
      <div className="container py-4">
        {/* HEADER */}
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="page-title">
                <i className="bi bi-calendar-check me-2"></i>
                Reuniones
              </h2>
              <p className="page-subtitle">
                Gestión de reuniones y control de asistencia con Robby.
              </p>
            </div>

            <button
              type="button"
              className="btn-add-reunion"
              // Aquí en el futuro puedes abrir un modal para crear reunión
              onClick={() => alert("Formulario de creación de reunión (futuro)")}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nueva reunión
            </button>
          </div>
        </div>

        {/* TABLA + EMPTY STATE */}
        <div className="table-section">
          <div className="table-container">
            <div className="table-responsive">
              <table className="table reuniones-table mb-0">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Horario</th>
                    <th>Tema</th>
                    <th>Ubicación</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>{renderTabla()}</tbody>
              </table>
            </div>

            {renderEmptyState()}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {renderModal()}
    </div>
  );
};

export default Reuniones;
