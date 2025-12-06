// src/types/index.ts

// ---- PROFESORES (ya los tenías) ----
export interface Profesor {
  id_usuario: string;
  first_name: string;
  second_name?: string;
  surname1: string;
  surname2?: string;
  email: string;
  rol_id?: string;
  active: boolean;
}

// ---- REUNIONES ----
export interface AttendanceEntry {
  detected: boolean;
  timestamp: string | null;
}

export interface Reunion {
  id: string;
  title: string;
  description?: string;
  date: string;        // "2024-01-14"
  start_time: string;  // "09:00"
  end_time: string;    // "11:00"
  room?: string | null;
  image_url?: string | null;
  observations?: string;
  active: boolean;
  attendance: Record<
    string,
    {
      detected: boolean;
      timestamp: string | null;
      // Opcional: para futuro si unes con usuarios
      full_name?: string;
      email?: string;
    }
  >;
}