import { LoginCredentials, RegisterData, AuthResponse, User } from "../types/user";

const API_URL = "http://localhost:8000";

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error al iniciar sesión");
    }

    return response.json();
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Error al registrar usuario");
    }

    return response.json();
  },

  me: async (token: string): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener información del usuario");
    }

    return response.json();
  },
};
