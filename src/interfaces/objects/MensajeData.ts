import { DetallePedidoData } from "./DetallePedidoData";
import { PedidoData } from "./PedidoData";
import { UserData } from "./UserData";


export interface MensajeData {
    // Campos propios
    id?: number;
    fechaCreacion?: Date;
    text?: string;
    status?: string;
    files?: string;
    tipo?:string;

    // FK's
    PedidoId?:number;
    DetallePedidoId?:number;
    UsuarioEscritorId?:number;
    UsuarioLectorId?:number;

    // Models
    Pedido?: PedidoData;
    DetallePedido?: DetallePedidoData;
    Escritor?: UserData;
    Lector?:UserData;
}
