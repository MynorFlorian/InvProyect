import { DetallePedidoData } from "./DetallePedidoData";
import { RolUsuarioData } from "./RolUsuarioData";
import { UserData } from "./UserData";
import {AvisoData} from './AvisoData'

export interface PedidoData{
    id?: number;
    fechaEntrega: Date | string;
    latitudEntrega: string;
    logitudEntrega: string;
    status: string;
    nombreCliente: string;
    telefonoCliente: string;
    tipoEntrega: string;
    costoFijo: number;
    imagenes?: string;
    imagenPrincipal?: string;
    descripcion?:string;
    cubiertos?:boolean
    calificacion?:number
    //FK
    
    UsuarioId?: number
    Usuario?: UserData,

    MetodoPagoId?:number;
    
    createdAt?: string,
    updatedAt?: string,

    //Has many
    AvisosPedido?:AvisoData[]
    DetallesPedido?:DetallePedidoData[]
}