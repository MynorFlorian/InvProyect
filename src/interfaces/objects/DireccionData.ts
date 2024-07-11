import { TerritorioData } from "./TerritorioData";
import { UserData } from "./UserData";

export interface DireccionData{
    descripcion:string;
    notas?: string;
    titulo?:string;
    direccionSeleccionada:boolean;
    longitud:string
    latitud:string
    // FK
    UsuarioId?:number;
    TerritorioId?:number;

    // Models
    Usuario?: UserData;
    Territorio?:TerritorioData;
}
