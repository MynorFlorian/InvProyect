import { PedidoBebidaData } from './PedidoBebida';
import { IngredienteExtraDetalleData } from "./IngredienteExtraDetalleData";
import { PlatilloData } from "./PlatilloData";

export interface DetallePedidoData{
    id?: number;
    cantidad: number;
    subTotal: number;
    descuentos: number;
    descripcion?: string;
    //FK
    PedidoId?: number;
    PlatilloId?: number;

    calificacion?: number

    Platillo?: PlatilloData;

    UsuarioEntregaId?: number;
    UsuarioCocineroId?: number;
    // Has many
    IngredienteExtraDetalles?: IngredienteExtraDetalleData[]
    Bebidas?: PedidoBebidaData[]
}