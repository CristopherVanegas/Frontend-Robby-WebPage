import { useEffect, useState } from "react";
import { getRoles } from "../api/roles";
import { updateProfesor } from "../api/users";

interface Props {
  show: boolean;
  profesor: any;
  onClose: () => void;
  refresh: () => void;
}

const EditProfesorModal = ({ show, profesor, onClose, refresh }: Props) => {
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (profesor) {
      setForm(profesor);
      getRoles().then((res) => setRoles(res.data));
    }
  }, [profesor]);

  if (!show) return null;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateProfesor(profesor.id, form);
      refresh();
      onClose();
    } catch {
      alert("Error al actualizar profesor");
    }
  };

  return (
    <div className="modal-backdrop show d-flex justify-content-center align-items-center">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h4>Editar Profesor</h4>

          <input className="form-control my-1" name="first_name" value={form.first_name} onChange={handleChange} />
          <input className="form-control my-1" name="surname1" value={form.surname1} onChange={handleChange} />
          <input className="form-control my-1" name="email" value={form.email} onChange={handleChange} />
          <input className="form-control my-1" name="username" value={form.username} onChange={handleChange} />

          <select name="faculty_role_id" className="form-control my-1" value={form.faculty_role_id} onChange={handleChange}>
            <option value="">Seleccione un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>

          <button className="btn btn-primary me-2 mt-2" onClick={handleSubmit}>Guardar</button>
          <button className="btn btn-secondary mt-2" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfesorModal;
