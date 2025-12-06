// src/pages/Reuniones.tsx
import { useEffect, useState } from "react";
import { getReuniones } from "../services/api";
import { Meeting } from "../types";

const Reuniones: React.FC = () => {
  const [reuniones, setReuniones] = useState<Meeting[]>([]);
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

  const contarAsistencia = (reunion: Meeting) => {
    const entries = Object.values(reunion.attendance ?? {});
    const presentes = entries.filter((a) => a.detected).length;
    const ausentes = entries.filter((a) => !a.detected).length;
    return { presentes, ausentes, total: entries.length };
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
            onClick={() => alert("Crear reunión (pendiente de implementar)")}
          >
            <i className="bi bi-plus-lg me-2"></i>
            Nueva Reunión
          </button>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando reuniones...</p>
          </div>
        ) : reuniones.length === 0 ? (
          // ESTADO VACÍO
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
          // LISTA DE REUNIONES (TODO BD)
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
                        {new Date(r.date).toLocaleDateString("es-EC", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
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

                    {/* Estado */}
                    <div className="ms-3">
                      <span
                        className={`badge ${
                          r.active ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {r.active ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reuniones;
