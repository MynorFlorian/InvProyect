import { RolUsuarioData } from "./RolUsuarioData";

export interface RolData {
    id?: number;
    nombre: string;
    tipo: string;
    permisos?: string;
    bloqueos?: string;

    // Models
    RolesUsuarios?: RolUsuarioData[];
}