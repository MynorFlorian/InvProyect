import { UserData } from "./UserData";
export interface ContactoRegistroData{
    fecha?:Date;
    comentarios?:string;
    observaciones?:string;

    // FK 
    UsuarioContactadoId?:number;
    UsuarioAdministrativoId?:number;

    // Models
    Usuario?: UserData;   
    Administrador?:UserData;
}