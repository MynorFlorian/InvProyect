import { IngredienteData } from "./IngredienteData";
import { UserData } from "./UserData";
import { AlergiaData } from "./AlergiaData";
import { IngredienteExtraData } from "./IngredienteExtraData";
import { DetallePedidoData } from "./DetallePedidoData";
import { FavoritoData } from './FavoritoData';

export interface PlatilloData {
    id?: number;
    nombre: string;
    fechaCreacion: Date | string;
    descripcion: string;
    costoFijo: number;
    imagenes?: string | '';
    imagenPrincipal?: string | '';

    //belongsTo
    SubCategoriasId?: number;
    showApp?: boolean;

    //FK
    UsuarioId?: number

    //Modelo
    Usuario?: UserData

    //Has many
    IngredientesPlatillo?: IngredienteData[],
    AlergiasPlatillo?: AlergiaData[],
    IngredientesExtraPlatillo?: IngredienteExtraData[],
    DetallesPedido?: DetallePedidoData[],
    Favoritos?: FavoritoData[]
}
