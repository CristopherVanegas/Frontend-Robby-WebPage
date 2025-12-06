import axios from "axios";

const API = "http://localhost:8000";

export const getProfesores = () => axios.get(`${API}/users`);
export const createProfesor = (data: any) =>
  axios.post(`${API}/users`, data);
export const updateProfesor = (id: string, data: any) =>
  axios.put(`${API}/users/${id}`, data);
export const deleteProfesor = (id: string) =>
  axios.delete(`${API}/users/${id}`);
