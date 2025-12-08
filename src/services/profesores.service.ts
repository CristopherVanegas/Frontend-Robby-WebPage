import { Profesor, ProfesorCreate } from "../types/profesor";

const API_URL = "http://localhost:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`
  };
};

export const profesoresService = {
  getAll: async (): Promise<Profesor[]> => {
    const response = await fetch(`${API_URL}/profesores/`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener profesores");
    return response.json();
  },

  getById: async (id: string): Promise<Profesor> => {
    const response = await fetch(`${API_URL}/profesores/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener profesor");
    return response.json();
  },

  create: async (data: ProfesorCreate): Promise<Profesor> => {
    const formData = new FormData();
    formData.append("primer_nombre", data.primer_nombre);
    formData.append("primer_apellido", data.primer_apellido);
    formData.append("segundo_nombre", data.segundo_nombre || "");
    formData.append("segundo_apellido", data.segundo_apellido || "");
    if (data.email) formData.append("email", data.email);
    formData.append("fecha_nacimiento", data.fecha_nacimiento);
    formData.append("facultad", data.facultad);
    formData.append("cubiculo", data.cubiculo);
    formData.append("rol", data.rol);
    formData.append("horario", JSON.stringify(data.horario));
    
    if (data.foto) {
      formData.append("foto", data.foto);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profesores/`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) throw new Error("Error al crear profesor");
    return response.json();
  },
  
  update: async (id: string, data: Partial<ProfesorCreate>): Promise<Profesor> => {
    const formData = new FormData();
    
    // Solo agregar campos que tengan valor
    if (data.primer_nombre) formData.append("primer_nombre", data.primer_nombre);
    if (data.primer_apellido) formData.append("primer_apellido", data.primer_apellido);
    if (data.segundo_nombre !== undefined) formData.append("segundo_nombre", data.segundo_nombre);
    if (data.segundo_apellido !== undefined) formData.append("segundo_apellido", data.segundo_apellido);
    if (data.email) formData.append("email", data.email);
    if (data.fecha_nacimiento) formData.append("fecha_nacimiento", data.fecha_nacimiento);
    if (data.facultad) formData.append("facultad", data.facultad);
    if (data.cubiculo) formData.append("cubiculo", data.cubiculo);
    if (data.rol) formData.append("rol", data.rol);
    if (data.horario) formData.append("horario", JSON.stringify(data.horario));
    if (data.foto) formData.append("foto", data.foto);

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profesores/${id}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Error al actualizar:", error);
      throw new Error("Error al actualizar profesor");
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/profesores/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error("Error al eliminar profesor");
  },

  getCubiculosDisponibles: async (): Promise<string[]> => {
    const response = await fetch(`${API_URL}/profesores/cubiculos/disponibles`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener cubículos");
    const data = await response.json();
    return data.cubiculos;
  },
};
