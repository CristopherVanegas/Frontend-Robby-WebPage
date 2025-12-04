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
