import { PlatilloData } from "./PlatilloData";

export interface CategoriaData {
    id?: number;
    nombre: string;
    descripcion?: string;
    imagen?: string;

    // Has many
    //subCategorias?: SubCategorias[];
    platillos?: PlatilloData[];
}