import { RolData } from "./RolData";
import { RolUsuarioData } from "./RolUsuarioData";

export interface UserData {
    id?: number;
    nombre: string;
    telefono?: string;
    correo?: string,
    hash?: string;
    imagenUsuario?: string,
    activada: boolean;
    eliminado: boolean;
    correoValido: boolean,
    telefonoValido: boolean,
    codigoAuxiliar?: string;
    codigoReferido?:string;
    consumidorStripe?:string;

    tipoUser?: string;

    // Referido code from referente
    codigoReferente?:string;
    UsuarioReferenteId?: number;

    //Banc. and personal information
    fechaNacimiento?: Date;
    licenciaConduccion?: string;
    status?: string;
    banco?: string;
    iban?: string;
    codigoPostal?: string;
    dni?: string;

    // Personal
    nombreP?: string;
    apellido?:string;
    calificacion?:number
    descripcion?:string;

    //Ubicacion
    provincia?: string;
    canton?: string;
    distrito?: string;
    postal?: string; 

    createdAt?: Date;
    
    // Registros de usuarios
    statusRegistro?:string;

    RolId?: number;

    Rol?: RolData;

    RolesUsuario?: RolUsuarioData[];
}
