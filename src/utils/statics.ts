
const VERSION = '1.0.0'
const DEV = false

export class Statics {
    static instance = new Statics()

    // Headers
    public readCredentials = { user: 'api-read' , pass: 'fu7rlbf9QF' };
    public writeCredentials = { user: 'api-write', pass: 'rfEBQ5X6RW'};
    public deleteCredentials = { user: 'api-delete', pass: 'mwwhG0IKMH'};

    // Routes
    public baseRoute = 'http://xxxx.xxx.xxx:3000/api'
    public userRoute = '/user'

    public meses = [
        { id: 1, name: "Enero" },
        { id: 2, name: "Febrero" },
        { id: 3, name: "Marzo" },
        { id: 4, name: "Abril" },
        { id: 5, name: "Mayo" },
        { id: 6, name: "Junio" },
        { id: 7, name: "Julio" },
        { id: 8, name: "Agosto" },
        { id: 9, name: "Septiembre" },
        { id: 10, name: "Octubre" },
        { id: 11, name: "Noviembre" },
        { id: 12, name: "Diciembre" },
    ];
}