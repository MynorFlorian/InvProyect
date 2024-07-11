const VERSION = '1.0.0';

const DEV = true;

export class Statics {
    static instance = new Statics()

    // Api Credentials
    public readCredentials = { user: 'api-read' , pass: 'fu7rlbf9QF' };
    public writeCredentials = { user: 'api-write', pass: 'rfEBQ5X6RW'};
    public deleteCredentials = { user: 'api-delete', pass: 'mwwhG0IKMH'};

    public version = VERSION;

    // Urls
    public urlDev = `http://localhost:4160/api`;
    public urlProd = 'https://api.Inventarioapp.com/api';
    public urlBase = this.urlDev
    public currencySymbol = 'Q';

    //Portal
    public portalDev = 'http://localhost:3000/'
    public portalProd = 'https://portal.Inventarioapp.com/'
    public portalBase = DEV ? this.portalDev : this.portalProd

    // Routes
    public rolesUrl = '/rol';
    public usersUrl = '/usuario';
    // public platilloUrl = '/platillo';
    // public pedidoUrl = '/pedido'
    // public dispositivoUrl = '/dispositivo'
    // public schedulesUrl = '/'
    // public entryUrl = '/ingreso'
    // public methodPaymentUrl = '/pago'
    // public categoriaUrl = '/categoria'
    // public subCategoriaUrl = '/subcategoria'
    // public busquedaUrl = '/busqueda'
    // public directionUrl = '/direccion'
    // public cuponUrl = '/cupon'
    // public promocionUrl = '/promocion'
    // public bebidaUrl = '/bebida'
    // public chatsUrl = '/chats';
    // public mensajeUrl = '/mensaje';
    // public notificacionesUrl = '/notificaciones';
    // public direccionUrl = '/direccion'
    // public logroUrl= '/logro'
    // public documentoUrl = '/documentos'
    // public logStatusUrl = '/logs'
    // public promocionesUrl = '/promoEspecial'
    // public reqContactoUrl = '/reqContacto'
    // public configurationUrl = '/configuracion'
    // public visualizacionUrl = '/visualizacion'
    // public territorioUrl = '/territorio'

    // AWS Credentials
    public urlUploadAWS = 'http://Inventario-bucket.s3-website-us-east-1.amazonaws.com/images/';

    public tiposBancos = [
        { id: "azteca", name: "Azteca" },
        { id: "bac", name: "BAC" },
        { id: "banco-credicorp", name: "Banco CREDICORP" },
        { id: "banco-antigua", name: "Banco de Antigua" },
        { id: "banco-guatemala", name: "Banco de Guatemala" },
        { id: "banco-inv-sa", name: "Banco INV S.A." },
        { id: "banco-industrial", name: "Banco Industrial" },
        { id: "banco-promerica", name: "Banco Promerica" },
        { id: "banrural", name: "Banrural" },
        { id: "bantrab", name: "BANTRAB" },
        { id: "citibank", name: "CITIBANK N.A." },
        { id: "cred-hip-nacional", name: "CRED. HIP. NACIONAL" },
        { id: "ficohsa", name: "FICOHSA" },
        { id: "gyt-continental", name: "G&T Continental" },
        { id: "inmobiliario", name: "Inmobiliario" },
    ];

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

    public anios = [
        { id: 2021, name: '2021' },
        { id: 2022, name: '2022' },
        { id: 2023, name: '2023' },
        { id: 2024, name: '2024' },
        { id: 2025, name: '2025' },
    ];

    public tiposImpuestos = [
        { id: "iva", name: "IVA" },
        { id: "isr", name: "ISR" },
    ];

    public bloquedRefreshEndPoints = [
        '/greenpay/',
        '/save-card/',
        '/platillos-publicos/',
    ]

    //MapBox api ULR
    public mapUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/greggs.json?access_token=${process.env.MAPBOX_KEY}&bbox=-0.227654%2C51.464102%2C0.060737%2C51.553421&limit=10`


    //Tipos de usuario

    public COCINERO_USER = 'cocinero'
    public CLIENTE_USER = 'cliente'
    public DELIVERY_USER = 'delivery'
    public ADMIN_USER = 'admin'
    public INFLUENCER_USER = 'influencer'


}
