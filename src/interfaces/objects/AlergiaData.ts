import { PlatilloData } from "./PlatilloData";

export interface AlergiaData{
    id?: number;
    nombre: string;
    costo: number;

    //Fk
    PlatilloId?:number

    Platillo?: PlatilloData
}