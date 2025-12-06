import { useEffect, useState } from "react";
import { getProfesores, deleteProfesor } from "../services/api";
import AddProfesorForm from "./AddProfesorForm";
import EditProfesorForm from "./EditProfesorForm";
import { Profesor } from "../types";


const Profesores = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfesor, setEditingProfesor] = useState<Profesor | null>(null);

  const fetchProfesores = async () => {
    try {
      const data = await getProfesores();
      setProfesores(data);
    } catch (error) {
      console.error("Error obteniendo profesores:", error);
    }
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar (desactivar) este profesor?")) {
      return;
    }

    try {
      await deleteProfesor(id);
      fetchProfesores();
    } catch (error) {
      console.error("Error eliminando profesor:", error);
    }
  };

  const handleEditClick = (profesor: Profesor) => {
    setEditingProfesor(profesor);
    setShowAddForm(false);
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setEditingProfesor(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Profesores</h3>
        <button className="btn btn-primary" onClick={handleAddClick}>
          Añadir Profesor
        </button>
      </div>

      {/* Formulario de Añadir */}
      {showAddForm && (
        <AddProfesorForm
          onClose={() => setShowAddForm(false)}
          refresh={fetchProfesores}
        />
      )}

      {/* Formulario de Editar */}
      {editingProfesor && (
        <EditProfesorForm
          profesor={editingProfesor}
          onClose={() => setEditingProfesor(null)}
          refresh={fetchProfesores}
        />
      )}

      {/* Tabla de profesores */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((p) => (
            <tr key={p.id_usuario}>
              <td>
                {p.first_name} {p.second_name}
              </td>
              <td>
                {p.surname1} {p.surname2}
              </td>
              <td>{p.email}</td>
              <td>{p.rol_id ?? "—"}</td>
              <td>{p.active ? "Activo" : "Inactivo"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditClick(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(p.id_usuario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {profesores.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                No hay profesores registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Profesores;
