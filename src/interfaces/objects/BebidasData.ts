import { UserData } from "./UserData";

export interface BebidasData{
    id?: number;
    nombre: string;
    costo: number;
    status: string;
    
    //FK
    UsuarioId?: number;
    Usuario?: UserData;

    cantidad?: number;
}