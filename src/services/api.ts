import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------- PROFESORES (Usuarios con rol docente) ----------------------

export const getProfesores = async () => {
  const res = await api.get("/users?rol=docente");
  return res.data;
};

export const createProfesor = async (data: any) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const updateProfesor = async (id: string, data: any) => {
  const res = await api.put(`/users/${id}`, data);
  return res.data;
};

export const deleteProfesor = async (id: string) => {
  const res = await api.patch(`/users/${id}/deactivate`);
  return res.data;
};

// ---------- REUNIONES ----------

export const getReuniones = async () => {
  const res = await api.get("/meetings");
  return res.data;
};

// Si luego quieres crear / editar / desactivar, los dejas ya listos:
export const createReunion = async (data: any) => {
  const res = await api.post("/meetings", data);
  return res.data;
};

export const updateReunion = async (id: string, data: any) => {
  const res = await api.put(`/meetings/${id}`, data);
  return res.data;
};

export const deactivateReunion = async (id: string) => {
  const res = await api.patch(`/meetings/${id}/deactivate`);
  return res.data;
};