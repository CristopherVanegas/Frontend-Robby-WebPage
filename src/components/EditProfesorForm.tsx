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
  const [formData, setFormData] = useState({ ...profesor });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfesor(profesor.id_usuario, formData);
    refresh();
    onClose();
  };

  return (
    <div className="card p-3 mb-3">
      <h4>Editar Profesor</h4>

      <form onSubmit={handleSubmit}>
        <input name="first_name" className="form-control mb-2" value={formData.first_name} onChange={handleChange} />
        <input name="second_name" className="form-control mb-2" value={formData.second_name} onChange={handleChange} />
        <input name="surname1" className="form-control mb-2" value={formData.surname1} onChange={handleChange} />
        <input name="surname2" className="form-control mb-2" value={formData.surname2} onChange={handleChange} />
        <input name="email" className="form-control mb-2" value={formData.email} onChange={handleChange} />
        <input name="username" className="form-control mb-2" value={formData.username} onChange={handleChange} />

        <button className="btn btn-warning me-2" type="submit">Actualizar</button>
        <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditProfesorForm;
