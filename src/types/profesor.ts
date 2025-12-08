export interface HorarioBloque {
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

export interface Profesor {
  id: string;
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email?: string;
  fecha_nacimiento: string;
  facultad: string;
  cubiculo: string;
  rol: string;
  horario: HorarioBloque[];
  nombre_completo: string;
  foto_url?: string;
  active: boolean;
  created_at?: string;
}

export interface ProfesorCreate {
  primer_nombre: string;
  segundo_nombre?: string;
  primer_apellido: string;
  segundo_apellido?: string;
  email?: string;
  fecha_nacimiento: string;
  facultad: string;
  cubiculo: string;
  rol: string;
  horario: HorarioBloque[];
  foto?: File;
}
