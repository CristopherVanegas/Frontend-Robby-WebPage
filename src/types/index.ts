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

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: string;          // en backend es date, aquí lo tratamos como string
  start_time: string;    // "09:00"
  end_time: string;      // "11:00"
  room: string;
  image_url?: string | null;
  observations?: string;
  active: boolean;
  attendance: {
    [userId: string]: AttendanceEntry;
  };
}
