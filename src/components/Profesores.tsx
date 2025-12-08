import { useState, useEffect } from "react";
import "./Profesores.css";
import { Profesor, HorarioBloque } from "../types/profesor";
import { profesoresService } from "../services/profesores.service";
import { configService } from "../services/config.service";

export default function Profesores() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [profesorSeleccionado, setProfesorSeleccionado] = useState<Profesor | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarFormModal, setMostrarFormModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Catálogos
  const [facultades, setFacultades] = useState<any[]>([]);
  const cubiculos = Array.from({length: 30}, (_, i) => (i + 1).toString());
  const roles = ["Docente", "Decano/a", "Secretario/a"];
  
  // Form state
  const [formData, setFormData] = useState({
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    email: "",
    fecha_nacimiento: "",
    facultad: "",
    cubiculo: "1",
    rol: "Docente",
    foto: null as File | null
  });
  const [horario, setHorario] = useState<HorarioBloque[]>([]);
  const [previewFoto, setPreviewFoto] = useState<string>("");

  useEffect(() => {
    cargarProfesores();
    cargarFacultades();
  }, []);

  const cargarProfesores = async () => {
    try {
      setLoading(true);
      const data = await profesoresService.getAll();
      setProfesores(data);
    } catch (error) {
      console.error("Error al cargar profesores:", error);
      alert("Error al cargar profesores");
    } finally {
      setLoading(false);
    }
  };

  const cargarFacultades = async () => {
    try {
      const data = await configService.getFacultades();
      setFacultades(data);
    } catch (error) {
      console.error("Error al cargar facultades:", error);
    }
  };

  const abrirFichaProfesor = (profesor: Profesor) => {
    setProfesorSeleccionado(profesor);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setProfesorSeleccionado(null);
  };

  const abrirFormCrear = () => {
    setModoEdicion(false);
    resetForm();
    setMostrarFormModal(true);
  };

  const abrirFormEditar = (profesor: Profesor) => {
    setModoEdicion(true);
    setProfesorSeleccionado(profesor);
    setFormData({
      primer_nombre: profesor.primer_nombre,
      segundo_nombre: profesor.segundo_nombre || "",
      primer_apellido: profesor.primer_apellido,
      segundo_apellido: profesor.segundo_apellido || "",
      email: profesor.email || "",
      fecha_nacimiento: profesor.fecha_nacimiento,
      facultad: profesor.facultad,
      cubiculo: profesor.cubiculo,
      rol: profesor.rol,
      foto: null
    });
    setHorario(profesor.horario || []);
    if (profesor.foto_url) {
      setPreviewFoto(`http://localhost:8000${profesor.foto_url}`);
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
      primer_nombre: "",
      segundo_nombre: "",
      primer_apellido: "",
      segundo_apellido: "",
      email: "",
      fecha_nacimiento: "",
      facultad: facultades[0]?.nombre || "",
      cubiculo: "1",
      rol: "Docente",
      foto: null
    });
    setHorario([]);
    setPreviewFoto("");
    setProfesorSeleccionado(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const agregarBloqueHorario = () => {
    setHorario([...horario, { dia: "Lunes", hora_inicio: "08:00", hora_fin: "12:00" }]);
  };

  const actualizarBloqueHorario = (index: number, field: string, value: string) => {
    const nuevoHorario = [...horario];
    nuevoHorario[index] = { ...nuevoHorario[index], [field]: value };
    setHorario(nuevoHorario);
  };

  const eliminarBloqueHorario = (index: number) => {
    setHorario(horario.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        horario
      };

      if (modoEdicion && profesorSeleccionado) {
        await profesoresService.update(profesorSeleccionado.id, dataToSend);
        alert("Profesor actualizado exitosamente");
      } else {
        await profesoresService.create(dataToSend);
        alert("Profesor creado exitosamente");
      }

      await cargarProfesores();
      cerrarFormModal();
    } catch (error) {
      console.error("Error al guardar profesor:", error);
      alert("Error al guardar profesor");
    } finally {
      setLoading(false);
    }
  };

  const eliminarProfesor = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este profesor?")) return;

    try {
      setLoading(true);
      await profesoresService.delete(id);
      alert("Profesor eliminado exitosamente");
      await cargarProfesores();
      cerrarModal();
    } catch (error) {
      console.error("Error al eliminar profesor:", error);
      alert("Error al eliminar profesor");
    } finally {
      setLoading(false);
    }
  };

  const organizarHorarioPorDias = (horario: HorarioBloque[]) => {
    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const horarioOrganizado: { [key: string]: HorarioBloque[] } = {};
    
    diasSemana.forEach(dia => {
      horarioOrganizado[dia] = horario.filter(h => h.dia === dia);
    });
    
    return horarioOrganizado;
  };

  return (
    <div className="profesores-container">
      <div className="container-fluid px-4 py-4">
        <div className="page-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="page-title">
                <i className="bi bi-person-badge-fill me-2"></i>
                Gestión de Profesores
              </h2>
              <p className="page-subtitle">
                Profesores registrados en el sistema
              </p>
            </div>
            <button className="btn btn-add-profesor" onClick={abrirFormCrear}>
              <i className="bi bi-plus-circle me-2"></i>
              Agregar Profesor
            </button>
          </div>
        </div>

        {loading && !mostrarModal && !mostrarFormModal ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="profesores-grid">
            {profesores.length > 0 ? (
              profesores.map((profesor) => (
                <div 
                  key={profesor.id} 
                  className="profesor-card shadow-sm"
                  onClick={() => abrirFichaProfesor(profesor)}
                >
                  <div className="profesor-foto-container">
                    <img 
                      src={profesor.foto_url ? `http://localhost:8000${profesor.foto_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profesor.nombre_completo)}&size=200&background=00A3E0&color=fff&bold=true`}
                      alt={profesor.nombre_completo}
                      className="profesor-foto"
                    />
                    <div className="foto-overlay">
                      <i className="bi bi-eye"></i>
                    </div>
                  </div>
                  <div className="profesor-info">
                    <h5 className="profesor-nombre">{profesor.nombre_completo}</h5>
                    <p className="profesor-facultad">
                      <i className="bi bi-building me-1"></i>
                      {profesor.facultad}
                    </p>
                    <div className="profesor-meta">
                      <span className="badge bg-info">{profesor.rol}</span>
                      <span className="badge bg-primary ms-1">
                        <i className="bi bi-door-closed me-1"></i>
                        Cubículo {profesor.cubiculo}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-profesores col-12">
                <div className="empty-icon">
                  <i className="bi bi-person-x"></i>
                </div>
                <h5 className="empty-title">No hay profesores registrados</h5>
                <p className="empty-description">
                  Comienza agregando profesores al sistema.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal - Ficha del Profesor */}
      {mostrarModal && profesorSeleccionado && (
        <>
          <div className="modal-overlay" onClick={cerrarModal}></div>
          <div className="modal-ficha">
            <div className="modal-header-custom">
              <h4 className="modal-title-custom">
                <i className="bi bi-person-circle me-2"></i>
                Ficha del Profesor
              </h4>
              <button className="btn-close-modal" onClick={cerrarModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              <div className="row">
                <div className="col-md-4 text-center mb-4">
                  <div className="ficha-foto-container">
                    <img 
                      src={profesorSeleccionado.foto_url ? `http://localhost:8000${profesorSeleccionado.foto_url}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profesorSeleccionado.nombre_completo)}&size=200&background=00A3E0&color=fff&bold=true`}
                      alt={profesorSeleccionado.nombre_completo}
                      className="ficha-foto"
                    />
                  </div>
                  <h4 className="ficha-nombre mt-3">{profesorSeleccionado.nombre_completo}</h4>
                  <span className="badge bg-info ficha-badge">{profesorSeleccionado.rol}</span>

                  <div className="ficha-section mt-4">
                    <h5 className="ficha-section-title">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Información Personal
                    </h5>
                    <div className="ficha-data-row">
                      <span className="ficha-label">
                        <i className="bi bi-calendar-heart me-1"></i>
                        Fecha Nacimiento
                      </span>
                      <span className="ficha-value">{profesorSeleccionado.fecha_nacimiento}</span>
                    </div>
                    {profesorSeleccionado.email && (
                      <div className="ficha-data-row">
                        <span className="ficha-label">
                          <i className="bi bi-envelope me-1"></i>
                          Email
                        </span>
                        <span className="ficha-value">{profesorSeleccionado.email}</span>
                      </div>
                    )}
                    <div className="ficha-data-row">
                      <span className="ficha-label">
                        <i className="bi bi-building me-1"></i>
                        Facultad
                      </span>
                      <span className="ficha-value">{profesorSeleccionado.facultad}</span>
                    </div>
                    <div className="ficha-data-row">
                      <span className="ficha-label">
                        <i className="bi bi-door-closed-fill me-1"></i>
                        Cubículo
                      </span>
                      <span className="ficha-value-highlight">{profesorSeleccionado.cubiculo}</span>
                    </div>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="ficha-section">
                    <h5 className="ficha-section-title">
                      <i className="bi bi-clock-fill me-2"></i>
                      Horario de Presencia
                    </h5>
                    
                    <div className="horario-semanal">
                      {Object.entries(organizarHorarioPorDias(profesorSeleccionado.horario)).map(([dia, bloques]) => (
                        <div key={dia} className="dia-horario">
                          <div className="dia-header">
                            <i className="bi bi-calendar3 me-2"></i>
                            {dia}
                          </div>
                          <div className="bloques-dia">
                            {bloques.length > 0 ? (
                              bloques.map((bloque, index) => (
                                <div key={index} className="bloque-horario disponible">
                                  <i className="bi bi-check-circle-fill me-2"></i>
                                  <span className="horario-tiempo">
                                    {bloque.hora_inicio} - {bloque.hora_fin}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="bloque-horario no-disponible">
                                <i className="bi bi-x-circle-fill me-2"></i>
                                <span className="horario-tiempo">No disponible</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <button className="btn btn-danger" onClick={() => eliminarProfesor(profesorSeleccionado.id)} disabled={loading}>
                <i className="bi bi-trash-fill me-2"></i>
                Eliminar
              </button>
              <button className="btn btn-secondary" onClick={cerrarModal}>
                <i className="bi bi-x-circle me-2"></i>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => abrirFormEditar(profesorSeleccionado)}>
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
          <div className="modal-ficha">
            <div className="modal-header-custom">
              <h4 className="modal-title-custom">
                <i className={`bi ${modoEdicion ? 'bi-pencil-fill' : 'bi-plus-circle'} me-2`}></i>
                {modoEdicion ? 'Editar Profesor' : 'Nuevo Profesor'}
              </h4>
              <button className="btn-close-modal" onClick={cerrarFormModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body-custom">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Primer Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="primer_nombre"
                      value={formData.primer_nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Segundo Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="segundo_nombre"
                      value={formData.segundo_nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Primer Apellido *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="primer_apellido"
                      value={formData.primer_apellido}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Segundo Apellido</label>
                    <input
                      type="text"
                      className="form-control"
                      name="segundo_apellido"
                      value={formData.segundo_apellido}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Fecha de Nacimiento *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Facultad *</label>
                    <select
                      className="form-select"
                      name="facultad"
                      value={formData.facultad}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {facultades.map(f => (
                        <option key={f.id} value={f.nombre}>{f.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Cubículo *</label>
                    <select
                      className="form-select"
                      name="cubiculo"
                      value={formData.cubiculo}
                      onChange={handleInputChange}
                      required
                    >
                      {cubiculos.map(c => (
                        <option key={c} value={c}>Cubículo {c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Rol *</label>
                    <select
                      className="form-select"
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      required
                    >
                      {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="form-label">Foto del Profesor</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFotoChange}
                    />
                    {previewFoto && (
                      <div className="mt-3 text-center">
                        <img src={previewFoto} alt="Preview" style={{ maxWidth: "200px", borderRadius: "8px" }} />
                      </div>
                    )}
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Horario</label>
                    <button type="button" className="btn btn-sm btn-success mb-2 ms-2" onClick={agregarBloqueHorario}>
                      <i className="bi bi-plus me-1"></i> Agregar Bloque
                    </button>
                    
                    {horario.map((bloque, index) => (
                      <div key={index} className="row mb-2 align-items-center">
                        <div className="col-md-3">
                          <select
                            className="form-select form-select-sm"
                            value={bloque.dia}
                            onChange={(e) => actualizarBloqueHorario(index, "dia", e.target.value)}
                          >
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={bloque.hora_inicio}
                            onChange={(e) => actualizarBloqueHorario(index, "hora_inicio", e.target.value)}
                          />
                        </div>
                        <div className="col-md-4">
                          <input
                            type="time"
                            className="form-control form-control-sm"
                            value={bloque.hora_fin}
                            onChange={(e) => actualizarBloqueHorario(index, "hora_fin", e.target.value)}
                          />
                        </div>
                        <div className="col-md-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => eliminarBloqueHorario(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
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