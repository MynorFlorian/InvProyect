import { IngredienteExtraDetalleData } from "./IngredienteExtraDetalleData";
import { PlatilloData } from "./PlatilloData";

export interface IngredienteExtraData{
    id?: number;
    nombre: string;
    costo: number;

    //Fk
    PlatilloId?:number
    Platillo?:PlatilloData

    //Has many
    IngredienteExtraDetalles?: IngredienteExtraDetalleData[]

    //Qty
    cantidad?: number;
    total?: number;
}