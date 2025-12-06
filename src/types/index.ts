import { ReactNode } from "react";

export interface Profesor {
    _id: string;
    titulo: string;
    apellido: ReactNode;
    id: string;
    nombre: string;
}

export interface Reunion {
    _id: string;
    asistentes: any;
    id: string;
    titulo: string;
    fecha: string;
}

// types.ts

export interface AttendanceEntry {
  detected: boolean;
  timestamp: string | null;
  name?: string; // opcional (por si luego guardas el nombre aqu�)
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date?: string;         // "2024-01-14"
  start_time?: string;   // "09:00" o "09:00:00"
  end_time?: string;     // "11:00" o "11:00:00"
  room?: string;
  image_url?: string | null;
  observations?: string;
  active: boolean;
  attendance: Record<string, AttendanceEntry>;
}
