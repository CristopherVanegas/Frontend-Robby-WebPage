const API_URL = "http://localhost:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const configService = {
  getFacultades: async () => {
    const response = await fetch(`${API_URL}/config/facultades`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener facultades");
    return response.json();
  },

  getSalas: async () => {
    const response = await fetch(`${API_URL}/config/salas`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener salas");
    return response.json();
  }
};