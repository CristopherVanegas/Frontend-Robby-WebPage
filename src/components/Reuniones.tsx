import { useState, useEffect } from "react";
import "./Reuniones.css";
import { Reunion, Asistente, Ausente } from "../types/reunion";
import { reunionesService } from "../services/reuniones.service";
import { profesoresService } from "../services/profesores.service";
import { configService } from "../services/config.service";
import { Profesor } from "../types/profesor";

export default function Reuniones() {
  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [reunionSeleccionada, setReunionSeleccionada] = useState<Reunion | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFormModal, setMostrarFormModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(false);

  // Catálogos
  const [salas, setSalas] = useState<any[]>([]);
  const [todosProfesores, setTodosProfesores] = useState<Profesor[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    tema: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    ubicacion: "",
    estado: "Programada",
    observaciones: "",
    foto: null as File | null
  });
  const [asistentes, setAsistentes] = useState<Asistente[]>([]);
  const [ausentes, setAusentes] = useState<Ausente[]>([]);
  const [previewFoto, setPreviewFoto] = useState<string>("");

  useEffect(() => {
    cargarReuniones();
    cargarSalas();
    cargarProfesores();
  }, []);

  const cargarReuniones = async () => {
    try {
      setLoading(true);
      const data = await reunionesService.getAll();
      setReuniones(data);
    } catch (error) {
      console.error("Error al cargar reuniones:", error);
      alert("Error al cargar reuniones");
    } finally {
      setLoading(false);
    }
  };

  const cargarSalas = async () => {
    try {
      const data = await configService.getSalas();
      setSalas(data);
    } catch (error) {
      console.error("Error al cargar salas:", error);
    }
  };

  const cargarProfesores = async () => {
    try {
      const data = await profesoresService.getAll();
      setTodosProfesores(data);
    } catch (error) {
      console.error("Error al cargar profesores:", error);
    }
  };

  const abrirFichaReunion = (reunion: Reunion) => {
    setReunionSeleccionada(reunion);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setReunionSeleccionada(null);
  };

  const abrirFormCrear = () => {
    setModoEdicion(false);
    resetForm();
    setMostrarFormModal(true);
  };

  const abrirFormEditar = (reunion: Reunion) => {
    setModoEdicion(true);
    setReunionSeleccionada(reunion);
    setFormData({
      tema: reunion.tema,
      fecha: reunion.fecha,
      hora_inicio: reunion.hora_inicio,
      hora_fin: reunion.hora_fin,
      ubicacion: reunion.ubicacion,
      estado: reunion.estado,
      observaciones: reunion.observaciones || "",
      foto: null
    });
    setAsistentes(reunion.asistentes || []);
    setAusentes(reunion.ausentes || []);
    if (reunion.imagen_url) {
      setPreviewFoto(`http://localhost:8000${reunion.imagen_url}`);
    }
    cerrarModal();
    setMostrarFormModal(true);
  };

  const cerrarFormModal = () => {
    setMostrarFormModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      tema: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      ubicacion: salas[0]?.nombre || "",
      estado: "Programada",
      observaciones: "",
      foto: null
    });
    setAsistentes([]);
    setAusentes([]);
    setPreviewFoto("");
    setReunionSeleccionada(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, foto: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAsistencia = (profesor: Profesor, tipo: 'asistente' | 'ausente') => {
    const nombre = profesor.nombre_completo;
    
    if (tipo === 'asistente') {
      // Si ya está en asistentes, quitarlo
      if (asistentes.some(a => a.nombre === nombre)) {
        setAsistentes(asistentes.filter(a => a.nombre !== nombre));
      } else {
        // Agregar a asistentes y quitar de ausentes si estaba
        setAsistentes([...asistentes, { nombre, estado: "Presente", hora_llegada: "" }]);
        setAusentes(ausentes.filter(a => a.nombre !== nombre));
      }
    } else {
      // Si ya está en ausentes, quitarlo
      if (ausentes.some(a => a.nombre === nombre)) {
        setAusentes(ausentes.filter(a => a.nombre !== nombre));
      } else {
        // Agregar a ausentes y quitar de asistentes si estaba
        setAusentes([...ausentes, { nombre, motivo: "No asistió" }]);
        setAsistentes(asistentes.filter(a => a.nombre !== nombre));
      }
    }
  };

  const actualizarHoraLlegada = (nombre: string, hora: string) => {
    setAsistentes(asistentes.map(a => 
      a.nombre === nombre ? { ...a, hora_llegada: hora } : a
    ));
  };

  const actualizarMotivoAusencia = (nombre: string, motivo: string) => {
    setAusentes(ausentes.map(a => 
      a.nombre === nombre ? { ...a, motivo } : a
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        asistentes,
        ausentes
      };

      if (modoEdicion && reunionSeleccionada) {
        await reunionesService.update(reunionSeleccionada.id, dataToSend);
        alert("Reunión actualizada exitosamente");
      } else {
        await reunionesService.create(dataToSend);
        alert("Reunión creada exitosamente");
      }

      await cargarReuniones();
      cerrarFormModal();
    } catch (error) {
      console.error("Error al guardar reunión:", error);
      alert("Error al guardar reunión");
    } finally {
      setLoading(false);
    }
  };

  const eliminarReunion = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta reunión?")) return;

    try {
      setLoading(true);
      await reunionesService.delete(id);
      alert("Reunión eliminada exitosamente");
      await cargarReuniones();
      cerrarModal();
    } catch (error) {
      console.error("Error al eliminar reunión:", error);
      alert("Error al eliminar reunión");
    } finally {
      setLoading(false);
    }
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
            <button className="btn btn-add-reunion" onClick={abrirFormCrear}>
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Reunión
            </button>
          </div>
        </div>

        <div className="table-section">
          <div className="table-container shadow-sm">
            {loading && !mostrarModal && !mostrarFormModal ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : reuniones.length > 0 ? (
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
                      <tr key={reunion.id} onClick={() => abrirFichaReunion(reunion)} style={{cursor: 'pointer'}}>
                        <td className="fecha-col">
                          <i className="bi bi-calendar3 me-2"></i>
                          {formatearFecha(reunion.fecha)}
                        </td>
                        <td className="tema-col">{reunion.tema}</td>
                        <td className="horario-col">
                          <i className="bi bi-clock me-1"></i>
                          {reunion.hora_inicio} - {reunion.hora_fin}
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
                <button className="btn btn-primary mt-3" onClick={abrirFormCrear}>
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
              <div className="reunion-info-header mb-4">
                <h3 className="reunion-tema">{reunionSeleccionada.tema}</h3>
                <div className="reunion-meta">
                  <span className="meta-item">
                    <i className="bi bi-calendar-check me-2"></i>
                    {formatearFecha(reunionSeleccionada.fecha)}
                  </span>
                  <span className="meta-item">
                    <i className="bi bi-clock-fill me-2"></i>
                    {reunionSeleccionada.hora_inicio} - {reunionSeleccionada.hora_fin}
                  </span>
                  <span className="meta-item">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {reunionSeleccionada.ubicacion}
                  </span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-5 mb-4">
                  {reunionSeleccionada.imagen_url && (
                    <div className="imagen-section mb-4">
                      <h5 className="section-title">
                        <i className="bi bi-camera-fill me-2"></i>
                        Imagen de la Reunión
                      </h5>
                      <div className="imagen-container">
                        <img 
                          src={`http://localhost:8000${reunionSeleccionada.imagen_url}`}
                          alt="Reunión"
                          className="imagen-reunion"
                        />
                      </div>
                    </div>
                  )}

                  <div className="resumen-asistencia">
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

                <div className="col-md-7">
                  {reunionSeleccionada.asistentes.length > 0 && (
                    <div className="asistencia-section mb-4">
                      <h5 className="section-title">
                        <i className="bi bi-person-check-fill me-2"></i>
                        Personas que Asistieron
                        <span className="badge bg-success ms-2">{reunionSeleccionada.asistentes.length}</span>
                      </h5>
                      <div className="personas-list">
                        {reunionSeleccionada.asistentes.map((persona, index) => (
                          <div key={index} className="persona-item presente-item">
                            <div className="persona-icon">
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <div className="persona-info">
                              <div className="persona-nombre">{persona.nombre}</div>
                              {persona.hora_llegada && (
                                <div className="persona-detalle">
                                  <i className="bi bi-clock me-1"></i>
                                  Llegada: {persona.hora_llegada}
                                </div>
                              )}
                            </div>
                            <div className="persona-estado">
                              <span className="badge bg-success">Presente</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {reunionSeleccionada.ausentes.length > 0 && (
                    <div className="ausencia-section mb-4">
                      <h5 className="section-title">
                        <i className="bi bi-person-x-fill me-2"></i>
                        Personas que NO Asistieron
                        <span className="badge bg-danger ms-2">{reunionSeleccionada.ausentes.length}</span>
                      </h5>
                      <div className="personas-list">
                        {reunionSeleccionada.ausentes.map((persona, index) => (
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
                  )}

                  {reunionSeleccionada.observaciones && (
                    <div className="observaciones-section">
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
              <button className="btn btn-danger" onClick={() => eliminarReunion(reunionSeleccionada.id)} disabled={loading}>
                <i className="bi bi-trash-fill me-2"></i>
                Eliminar
              </button>
              <button className="btn btn-secondary" onClick={cerrarModal}>
                <i className="bi bi-x-circle me-2"></i>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => abrirFormEditar(reunionSeleccionada)}>
                <i className="bi bi-pencil-fill me-2"></i>
                Editar
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal - Formulario Crear/Editar */}
      {mostrarFormModal && (
        <>
          <div className="modal-overlay" onClick={cerrarFormModal}></div>
          <div className="modal-ficha-reunion" style={{maxHeight: '95vh', overflowY: 'auto'}}>
            <div className="modal-header-custom">
              <h4 className="modal-title-custom">
                <i className={`bi ${modoEdicion ? 'bi-pencil-fill' : 'bi-plus-circle'} me-2`}></i>
                {modoEdicion ? 'Editar Reunión' : 'Nueva Reunión'}
              </h4>
              <button className="btn-close-modal" onClick={cerrarFormModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body-custom">
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Tema de la Reunión *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tema"
                      value={formData.tema}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Fecha *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Hora Inicio *</label>
                    <input
                      type="time"
                      className="form-control"
                      name="hora_inicio"
                      value={formData.hora_inicio}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Hora Fin *</label>
                    <input
                      type="time"
                      className="form-control"
                      name="hora_fin"
                      value={formData.hora_fin}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Sala *</label>
                    <select
                      className="form-select"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {salas.map(s => (
                        <option key={s.id} value={s.nombre}>{s.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Estado *</label>
                    <select
                      className="form-select"
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Programada">Programada</option>
                      <option value="En Curso">En Curso</option>
                      <option value="Completada">Completada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Foto de la Reunión</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFotoChange}
                    />
                    {previewFoto && (
                      <div className="mt-3 text-center">
                        <img src={previewFoto} alt="Preview" style={{ maxWidth: "300px", borderRadius: "8px" }} />
                      </div>
                    )}
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Observaciones</label>
                    <textarea
                      className="form-control"
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>

                  {/* Gestión de Asistencia */}
                  <div className="col-12 mb-3">
                    <h5 className="section-title mb-3">
                      <i className="bi bi-people-fill me-2"></i>
                      Gestión de Asistencia
                    </h5>
                    
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Profesor</th>
                            <th>Asistió</th>
                            <th>No Asistió</th>
                            <th>Detalles</th>
                          </tr>
                        </thead>
                        <tbody>
                          {todosProfesores.map(profesor => {
                            const asistio = asistentes.find(a => a.nombre === profesor.nombre_completo);
                            const falto = ausentes.find(a => a.nombre === profesor.nombre_completo);
                            
                            return (
                              <tr key={profesor.id}>
                                <td>{profesor.nombre_completo}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={!!asistio}
                                    onChange={() => toggleAsistencia(profesor, 'asistente')}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={!!falto}
                                    onChange={() => toggleAsistencia(profesor, 'ausente')}
                                  />
                                </td>
                                <td>
                                  {asistio && (
                                    <input
                                      type="time"
                                      className="form-control form-control-sm"
                                      placeholder="Hora llegada"
                                      value={asistio.hora_llegada || ""}
                                      onChange={(e) => actualizarHoraLlegada(profesor.nombre_completo, e.target.value)}
                                    />
                                  )}
                                  {falto && (
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      placeholder="Motivo"
                                      value={falto.motivo}
                                      onChange={(e) => actualizarMotivoAusencia(profesor.nombre_completo, e.target.value)}
                                    />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button type="button" className="btn btn-secondary" onClick={cerrarFormModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}