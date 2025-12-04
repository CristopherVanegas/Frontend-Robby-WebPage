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
