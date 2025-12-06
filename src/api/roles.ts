import axios from "axios";

const API = "http://localhost:8000";

export const getRoles = () => axios.get(`${API}/roles`);
export const createRole = (data: { name: string }) =>
  axios.post(`${API}/roles`, data);
export const updateRole = (id: string, data: any) =>
  axios.put(`${API}/roles/${id}`, data);
export const deleteRole = (id: string) =>
  axios.delete(`${API}/roles/${id}`);
