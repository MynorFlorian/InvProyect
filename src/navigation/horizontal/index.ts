// ** Icon imports
import ChartLine from 'mdi-material-ui/ChartLine'
import ChartDonut from 'mdi-material-ui/ChartDonut'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import ChartBellCurve from 'mdi-material-ui/ChartBellCurve'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import ChartBellCurveCumulative from 'mdi-material-ui/ChartBellCurveCumulative'

// ** Type import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): HorizontalNavItemsType => {

    return [

        // * Dashboard *
        {
            icon: HomeOutline,
            title: 'Dashboard',
            path: '/dashboard'
        },

        // * Chats *
        // {
        //     title: 'Chats',
        //     icon: MessageOutline,
        //     path: '/apps/chat'
        // },

        // // * Usuarios *
        // {
        //     title: 'Usuarios',
        //     icon: AccountOutline,
        //     children: [
        //         {
        //             icon: AccountOutline,
        //             title: 'Nuevo Usuario',
        //             path: '/pages/account-settings'
        //         },
        //         {
        //             title: 'Supervisores',
        //             path: '/apps/user/list'
        //         },
        //         {
        //             title: 'Abogados',
        //             path: '/apps/user/list'
        //         },
        //         {
        //             title: 'Cuentas',
        //             path: '/apps/user/list'
        //         },
        //         {
        //             title: 'Rechazos',
        //             path: '/apps/user/list'
        //         },
        //         {
        //             title: 'Detalle de usuario',
        //             path: '/apps/user/view'
        //         }
        //     ]
        // },

        // // * Contenido *
        // {
        //     icon: CubeOutline,
        //     title: 'Contenido',
        //     path: '/contenido'
        // },

        // // * Reportes *
        // {
        //     title: 'Reportes',
        //     icon: ChartDonut,
        //     children: [
        //         {
        //             title: 'Ventas',
        //             icon: ChartLine,
        //             path: '/charts/apex-charts'
        //         },
        //     ]
        // },

    ]
}

export default navigation
