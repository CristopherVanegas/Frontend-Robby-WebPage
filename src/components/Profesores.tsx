import { useEffect, useState } from "react";
import { getProfesores, deleteProfesor } from "../services/api";
import AddProfesorForm from "./AddProfesorForm";
import EditProfesorForm from "./EditProfesorForm";

interface Profesor {
  id_usuario: string;
  first_name: string;
  second_name?: string;
  surname1: string;
  surname2?: string;
  email: string;
  active: boolean;
}

const Profesores = () => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState<Profesor | null>(null);

  const loadProfesores = async () => {
    const data = await getProfesores();
    setProfesores(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas desactivar este profesor?")) return;
    await deleteProfesor(id);
    loadProfesores();
  };

  useEffect(() => {
    loadProfesores();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Profesores</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAdd(true)}
      >
        Añadir Profesor
      </button>

      {/* FORMULARIO AGREGAR */}
      {showAdd && (
        <AddProfesorForm
          onClose={() => setShowAdd(false)}
          refresh={loadProfesores}
        />
      )}

      {/* FORMULARIO EDITAR */}
      {editData && (
        <EditProfesorForm
          profesor={editData}
          onClose={() => setEditData(null)}
          refresh={loadProfesores}
        />
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {profesores.map((p) => (
            <tr key={p.id_usuario}>
              <td>{p.first_name} {p.second_name}</td>
              <td>{p.surname1} {p.surname2}</td>
              <td>{p.email}</td>
              <td>{p.active ? "Activo" : "Inactivo"}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => setEditData(p)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p.id_usuario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profesores;
