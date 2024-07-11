import { UserData } from "./UserData";

export interface AvisoData{
    id?: number;
    titulo: string;
    mensaje: string;
    status: string;

    //FK
    PedidoId?: number;
    UsuarioDestinoId?: number;
    UsuarioCreadorId?: number;

    Usuario?: UserData
    //Has many
}