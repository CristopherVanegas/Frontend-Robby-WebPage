interface Props {
  profesor: any;
  onEdit: () => void;
  onDelete: () => void;
}

const ProfesorCard = ({ profesor, onEdit, onDelete }: Props) => {
  const initials =
    profesor.first_name.charAt(0).toUpperCase() +
    profesor.surname1.charAt(0).toUpperCase();

  return (
    <div className="profesor-card mb-3">
      <div className="d-flex align-items-center">
        <div className="avatar-circle me-3">{initials}</div>

        <div>
          <h5 className="mb-1">
            {profesor.first_name} {profesor.surname1}
          </h5>
          <div className="text-muted">{profesor.email}</div>
          <div className="text-muted">
            Rol Facultad: {profesor.faculty_role_id || "—"}
          </div>
        </div>
      </div>

      <div className="card-actions mt-3">
        <button className="btn btn-primary btn-sm me-2" onClick={onEdit}>
          Editar
        </button>
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ProfesorCard;
