import { RolData } from "./RolData";
import { UserData } from "./UserData";

export interface RolUsuarioData {
    id?: number;

    // FK
    UsuarioId?: number;
    RolId?: number;

    // Models
    Usuario?: UserData;
    Rol?: RolData;
}