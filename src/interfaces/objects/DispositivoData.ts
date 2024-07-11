import { UserData } from "./UserData";


export interface DispositivoData{
    id?: number;
    tokenFMC: string;
    os: string;
    fecha: Date

    activo?: boolean
    //FK
    UsuarioId?: number
    Usuario?: UserData

}