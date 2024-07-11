import { DetallePedidoData } from "./DetallePedidoData";
import { IngredienteExtraData } from "./IngredienteExtraData";

export interface IngredienteExtraDetalleData{
    id?: number;

    cantidad?: number;
    subtotal?: number;

    //FK
    DetallePedidoId?: number
    IngredienteExtraId?: number

    DetallePedido?:DetallePedidoData
    IngredienteExtra?:IngredienteExtraData
}