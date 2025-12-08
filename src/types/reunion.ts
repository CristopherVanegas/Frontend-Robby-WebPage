export interface Asistente {
  nombre: string;
  estado: string;
  hora_llegada?: string;
}

export interface Ausente {
  nombre: string;
  motivo: string;
}

export interface Reunion {
  id: string;
  tema: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  ubicacion: string;
  estado: string;
  imagen_url?: string;
  observaciones?: string;
  asistentes: Asistente[];
  ausentes: Ausente[];
  active: boolean;
  created_at?: string;
}

export interface ReunionCreate {
  tema: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  ubicacion: string;
  estado?: string;
  observaciones?: string;
  asistentes?: Asistente[];
  ausentes?: Ausente[];
  foto?: File;
}
