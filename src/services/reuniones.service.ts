import { Reunion, ReunionCreate } from "../types/reunion";

const API_URL = "http://localhost:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const reunionesService = {
  getAll: async (): Promise<Reunion[]> => {
    const response = await fetch(`${API_URL}/reuniones/`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener reuniones");
    return response.json();
  },

  getById: async (id: string): Promise<Reunion> => {
    const response = await fetch(`${API_URL}/reuniones/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener reunión");
    return response.json();
  },

  create: async (data: ReunionCreate): Promise<Reunion> => {
    const formData = new FormData();
    formData.append("tema", data.tema);
    formData.append("fecha", data.fecha);
    formData.append("hora_inicio", data.hora_inicio);
    formData.append("hora_fin", data.hora_fin);
    formData.append("ubicacion", data.ubicacion);
    formData.append("estado", data.estado || "Programada");
    formData.append("observaciones", data.observaciones || "");
    formData.append("asistentes", JSON.stringify(data.asistentes || []));
    formData.append("ausentes", JSON.stringify(data.ausentes || []));
    
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reuniones/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Error al crear reunión");
    return response.json();
  },

  update: async (id: string, data: Partial<ReunionCreate>): Promise<Reunion> => {
    const formData = new FormData();
    
    // Solo agregar campos que tengan valor
    if (data.tema) formData.append("tema", data.tema);
    if (data.fecha) formData.append("fecha", data.fecha);
    if (data.hora_inicio) formData.append("hora_inicio", data.hora_inicio);
    if (data.hora_fin) formData.append("hora_fin", data.hora_fin);
    if (data.ubicacion) formData.append("ubicacion", data.ubicacion);
    if (data.estado) formData.append("estado", data.estado);
    if (data.observaciones !== undefined) formData.append("observaciones", data.observaciones);
    if (data.asistentes) formData.append("asistentes", JSON.stringify(data.asistentes));
    if (data.ausentes) formData.append("ausentes", JSON.stringify(data.ausentes));
    if (data.foto) formData.append("foto", data.foto);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reuniones/${id}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error al actualizar:", error);
      throw new Error("Error al actualizar reunión");
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/reuniones/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al eliminar reunión");
  },
};
