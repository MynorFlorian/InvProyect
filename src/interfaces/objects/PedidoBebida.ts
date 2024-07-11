import { DetallePedidoData } from "./DetallePedidoData";
import { PedidoData } from "./PedidoData";
import { BebidasData } from "./BebidasData";

export interface PedidoBebidaData {
    cantidad: number;
    costo: number;

    // FK
    PedidoId?:number;
    Pedido?: PedidoData;

    // FK
    DetallePedidoId?:number;
    DetallePedido?: DetallePedidoData;

    // FK
    BebidadId?:number;
    Bebida?: BebidasData;
}