export interface MetodoPagoData{
    id?:number;

    // Card, campo number y cvc nunca se guarda
    titular?:string;
    number?:string;
    mesExpiracion?:number;
    anioExpiracion?:number;
    cvc?:string;
    ultimosDigitos?:string;

    // Paypal
    usuarioPayPal?:string;
    tokenPayPal?:string;

    // helpers
    tipoMetodo:string;
    metodoPagoStripe?:string;
    metodoPagoSeleccinado?:boolean;

    // Usuario
    alias:string;
    UsuarioId?:number;


}