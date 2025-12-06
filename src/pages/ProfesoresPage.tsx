import { useEffect, useState } from "react";
import { getProfesores, deleteProfesor } from "../api/users";
import ProfesorCard from "../components/ProfesorCard";
import AddProfesorModal from "../components/AddProfesorModal";
import EditProfesorModal from "../components/EditProfesorModal";

const ProfesoresPage = () => {
  const [profesores, setProfesores] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const load = async () => {
    const res = await getProfesores();
    setProfesores(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Profesores</h2>

      <button className="btn btn-success mb-3" onClick={() => setShowAdd(true)}>
        + Nuevo Profesor
      </button>

      {profesores.map((p) => (
        <ProfesorCard
          key={p.id}
          profesor={p}
          onEdit={() => setEditData(p)}
          onDelete={() => {
            if (confirm("¿Eliminar profesor?")) deleteProfesor(p.id).then(load);
          }}
        />
      ))}

      <AddProfesorModal show={showAdd} onClose={() => setShowAdd(false)} refresh={load} />

      <EditProfesorModal
        show={!!editData}
        profesor={editData}
        onClose={() => setEditData(null)}
        refresh={load}
      />
    </div>
  );
};

export default ProfesoresPage;
