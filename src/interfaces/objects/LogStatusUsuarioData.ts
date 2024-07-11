import { UserData } from "./UserData";

export interface LogStatusUsuarioData{
    fecha?:Date;
    statusAnt?:string;
    statusPos?:string;

    // FK 
    UsuarioAdministrativoId?:number;
    UsuarioId?:number;

    // Models
    Administrador?: UserData;   
    Usuario?:UserData;
}