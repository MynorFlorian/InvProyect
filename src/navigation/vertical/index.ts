// ** Icon imports
import ChartDonut from 'mdi-material-ui/ChartDonut'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import FileDocument from 'mdi-material-ui/FileDocument'
import Food from 'mdi-material-ui/Food'
import { FormatListBulleted, PlusCircle, CellphoneMessage, MapLegend, CogOutline, SelectGroup } from 'mdi-material-ui'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { ChartBellCurve, ChartBellCurveCumulative, ChartLine } from 'mdi-material-ui'
import { useAuth } from 'src/hooks/useAuth'
import { Statics } from 'src/utils/statics'

// ** Hook Imports

const navigation = (): VerticalNavItemsType => {

    const auth = useAuth();

    // if(auth.isAdmin()) {
        return [

            // * Dashboard *
            {
                icon: HomeOutline,
                title: 'Dashboard',
                path: '/dashboard'
            },


        ];
    // }



    return [];
}

export default navigation
