export interface IngredienteData {
    id?: number,
    nombre: string;
    costo: number;

    //FK
    cantidad?:number
    PlatilloId?: number
}