import { useState, useEffect } from "react";
import { createRole, updateRole } from "../api/roles";

interface Props {
  show: boolean;
  onClose: () => void;
  editData?: any;
  refresh: () => void;
}

const RoleModal = ({ show, onClose, editData, refresh }: Props) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (editData) setName(editData.name);
    else setName("");
  }, [editData]);

  if (!show) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("El nombre del rol es obligatorio");
      return;
    }

    try {
      if (editData) await updateRole(editData.id, { name });
      else await createRole({ name });

      refresh();
      onClose();
    } catch (err) {
      alert("Error al guardar el rol");
    }
  };

  return (
    <div className="modal-backdrop show d-flex justify-content-center align-items-center">
      <div className="modal-dialog">
        <div className="modal-content p-3">
          <h4>{editData ? "Editar Rol" : "Nuevo Rol"}</h4>

          <input
            className="form-control my-2"
            placeholder="Nombre del rol"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button className="btn btn-primary me-2" onClick={handleSubmit}>
            Guardar
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
