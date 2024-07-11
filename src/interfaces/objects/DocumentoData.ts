import { UserData } from "./UserData";

export interface DocumentoData {
    id?: number;
    nombre: string;
    imagen: string;
    validado: boolean;
    tipo: string;

    //FK
    UsuarioValidadorId?: number;
    //belongsTo
    UsuarioId: number;

    //Model
    Usuario?: UserData;
    UsuarioValidador?: UserData;
}