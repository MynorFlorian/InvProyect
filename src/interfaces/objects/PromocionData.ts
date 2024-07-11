export interface PromocionData{
    id?:number;
    titulo:string;
    descripcion?:string;
    status: string;
    codigoDescuento: string;
    fechaExpiracion: Date;
}