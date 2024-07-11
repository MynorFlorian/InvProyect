import { MensajeData } from "./MensajeData";
import { PedidoData } from "./PedidoData";
import { UserData } from "./UserData";


export interface ChatData {
    id?: number;
    fechaCreacion?: Date;
    tipo?: string;
    status?: string;

    // FK's
    UsuarioEscritorId?:number;
    UsuarioLectorId?:number;
    PedidoId?:number;

    // Models
    Mensajes?: MensajeData[];
    Escritor?: UserData;
    Lector?: UserData;
    Pedido?: PedidoData;
}
