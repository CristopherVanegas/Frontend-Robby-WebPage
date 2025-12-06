import { useState, useEffect } from "react";
import { createProfesor } from "../api/users";
import { getRoles } from "../api/roles";

interface Props {
  show: boolean;
  onClose: () => void;
  refresh: () => void;
}

const AddProfesorModal = ({ show, onClose, refresh }: Props) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({
    first_name: "",
    second_name: "",
    surname1: "",
    surname2: "",
    email: "",
    username: "",
    password: "123456",
    faculty_role_id: "",
  });

  useEffect(() => {
    getRoles().then((res) => setRoles(res.data));
  }, []);

  if (!show) return null;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createProfesor(form);
      refresh();
      onClose();
    } catch {
      alert("Error al crear profesor");
    }
  };

  return (
    <div className="modal-backdrop show d-flex justify-content-center align-items-center">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h4>Nuevo Profesor</h4>

          <input
            name="first_name"
            className="form-control my-1"
            placeholder="Nombre"
            onChange={handleChange}
          />

          <input
            name="second_name"
            className="form-control my-1"
            placeholder="Segundo Nombre"
            onChange={handleChange}
          />

          <input
            name="surname1"
            className="form-control my-1"
            placeholder="Primer Apellido"
            onChange={handleChange}
          />

          <input
            name="surname2"
            className="form-control my-1"
            placeholder="Segundo Apellido"
            onChange={handleChange}
          />

          <input
            name="email"
            className="form-control my-1"
            placeholder="Correo electrónico"
            onChange={handleChange}
          />

          <input
            name="username"
            className="form-control my-1"
            placeholder="Usuario"
            onChange={handleChange}
          />

          <select
            name="faculty_role_id"
            className="form-control my-1"
            onChange={handleChange}
          >
            <option value="">Seleccione un rol de facultad</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          <button className="btn btn-primary me-2 mt-2" onClick={handleSubmit}>
            Guardar
          </button>
          <button className="btn btn-secondary mt-2" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProfesorModal;
