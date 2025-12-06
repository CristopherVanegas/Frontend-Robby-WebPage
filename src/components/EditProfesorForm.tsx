import { useState } from "react";
import { updateProfesor } from "../services/api";

interface Profesor {
  id_usuario: string;
  first_name: string;
  second_name?: string;
  surname1: string;
  surname2?: string;
  email: string;
  username: string;
  rol_id: string;
}

interface Props {
  profesor: Profesor;
  onClose: () => void;
  refresh: () => void;
}

const EditProfesorForm = ({ profesor, onClose, refresh }: Props) => {
  const [formData, setFormData] = useState({
    first_name: profesor.first_name,
    second_name: profesor.second_name || "",
    surname1: profesor.surname1,
    surname2: profesor.surname2 || "",
    email: profesor.email,
    username: profesor.username,
    rol_id: profesor.rol_id || "docente",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfesor(profesor.id_usuario, formData);
      refresh();
      onClose();
    } catch (error) {
      console.error("Error actualizando profesor:", error);
    }
  };

  return (
    <div className="card p-3 mb-3">
      <h4 className="mb-3">Editar Profesor</h4>

      <form onSubmit={handleSubmit}>
        <input
          name="first_name"
          className="form-control mb-2"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="Nombre"
        />
        <input
          name="second_name"
          className="form-control mb-2"
          value={formData.second_name}
          onChange={handleChange}
          placeholder="Segundo nombre"
        />
        <input
          name="surname1"
          className="form-control mb-2"
          value={formData.surname1}
          onChange={handleChange}
          placeholder="Primer apellido"
        />
        <input
          name="surname2"
          className="form-control mb-2"
          value={formData.surname2}
          onChange={handleChange}
          placeholder="Segundo apellido"
        />
        <input
          name="email"
          className="form-control mb-2"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
        />
        <input
          name="username"
          className="form-control mb-2"
          value={formData.username}
          onChange={handleChange}
          placeholder="Usuario"
        />

        {/* Rol */}
        <div className="mb-2">
          <select
            name="rol_id"
            className="form-select mb-2"
            value={formData.rol_id}
            onChange={handleChange}
          >
            <option value="">Seleccione un rol</option>
            <option value="docente">Docente</option>
            <option value="decano">Decana/o</option>
            <option value="coordinador">Coordinador</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>

        <button className="btn btn-warning me-2" type="submit">
          Actualizar
        </button>
        <button className="btn btn-secondary" type="button" onClick={onClose}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default EditProfesorForm;
