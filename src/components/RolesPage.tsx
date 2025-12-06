import { useEffect, useState } from "react";
import { getRoles, deleteRole } from "../api/roles";
import RoleModal from "./RoleModal";

const RolesPage = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const load = async () => {
    const res = await getRoles();
    setRoles(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Roles (Jerarquías Facultad)</h2>

      <button
        className="btn btn-success mb-3"
        onClick={() => {
          setEditData(null);
          setShowModal(true);
        }}
      >
        + Nuevo Rol
      </button>

      <div className="list-group">
        {roles.map((r) => (
          <div
            key={r.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <strong>{r.name}</strong>

            <div>
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => {
                  setEditData(r);
                  setShowModal(true);
                }}
              >
                Editar
              </button>

              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  if (confirm("¿Eliminar rol?")) deleteRole(r.id).then(load);
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <RoleModal
        show={showModal}
        onClose={() => setShowModal(false)}
        editData={editData}
        refresh={load}
      />
    </div>
  );
};

export default RolesPage;
