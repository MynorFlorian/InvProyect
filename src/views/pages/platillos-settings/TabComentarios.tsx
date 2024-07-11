// ** React Imports
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import { PlatilloData } from 'src/interfaces/objects/PlatilloData'
import { styled } from '@mui/material/styles'
import {TextField} from  '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'
// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserService from 'src/services/UserService'
import PlatilloService from 'src/services/PlatilloService'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import toast from 'react-hot-toast'

import { getInitials } from 'src/@core/utils/get-initials'
import { PedidoService } from 'src/services/PedidoService'

const service = new PlatilloService()
const pedidoService = new PedidoService()

interface State{

}

interface Props{
    PlatilloId?: number,
    callback?: any
}

interface CellType {
    row: any,
}


  // ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
    marginRight: theme.spacing(3)
}))

const RowOptions = ({ id }: { id: number | string }) => {

      // Globals
    const router = useRouter()

     // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

     // ** Hooks

     // Redirect to edit
    const handleRowOptionsRedirect = () => {
        //router.push(`/users/platillo/${id}`);

        //console.log("ID DE PLATILLO",id)

        router.push(`/platillos/${id}`);
    }
    
    return (
        <>
            <IconButton size='small' onClick={handleRowOptionsRedirect}>
                <PencilOutline fontSize='small' sx={{ mr: 2 }} />
            </IconButton>
        </>
    )
}

const renderPlatillo = (name: string) =>{
    return(<>
        <CustomAvatar
            skin='light'
            color={'primary'}
            sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
        >
            {getInitials(name)}
        </CustomAvatar>
    </>)
}

const defaultColumns = [
    // Nombre
    {
        flex: 0.25,
        minWidth: 230,
        field: 'fullName',
        headerName: 'Nombre',
        renderCell: ({ row }: CellType) => {
        //const { nombre } = row
        const fullName = row.Usuario.nombre;

        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderPlatillo(fullName)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                    noWrap
                    component='a'
                    variant='body2'
                    sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}
                >
                    {fullName}
                </Typography>
            </Box>
            </Box>
        )
        }
    },

    {
        flex: 0.25,
        field: 'number',
        maxWidth: 150,
        headerName: 'Número de Pedido',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                {row.DetallePedido.PedidoId}
                </Typography>
            )
        }
    },
    {
        flex: 0.25,
        field: 'mensaje',
        minWidth: 250,
        headerName: 'Mensaje',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                {row.mensaje}
                </Typography>
            )
        }
    },

    //     // Descripcion
    // {
    //     flex: 0.2,
    //     minWidth: 150,
    //     headerName: 'Descripcion',
    //     field: 'currentPlan',
    //     renderCell: ({ row }: CellType) => {
    //         let rol = row.descripcion
    //         return (
    //             <Typography noWrap sx={{ textTransform: 'capitalize' }}>
    //                 {rol}
    //             </Typography>
                
    //         )
    //     }
    // },

    // Actions
    // {
    //     flex: 0.15,
    //     minWidth: 75,
    //     sortable: false,
    //     field: 'actions',
    //     headerName: '',
    //     renderCell: ({ row }: CellType) => {
    //         return row.id ? <RowOptions id={row.id}/> : <></>
    //     },
    // }
]

const TabComentarios = ({PlatilloId, callback}: Props) =>{

    const [search, setSearch] = useState<string|undefined>(undefined)

    const [pageSize, setPageSize] = useState<number>(10)
    const [countRegisters, setCountRegisters] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [currentDataPage, setCurrentDataPage] = useState<PlatilloData[]>([])
    const router = useRouter()


    useEffect(()=>{
        if(PlatilloId){
            console.log("Como vergas???")
            getPage(1)
        }
    },[])

    const getPage = async(page:number=0) =>{
        let query = '?';
        query += `page=${page}`;
        query += `&size=${pageSize}`;
        query += `&PlatilloId=${PlatilloId}`
        if(search) query += `&search=${search}`;
        //query += `&size=${UsuarioId}`

        let result = await service.getComentarios(PlatilloId)

        console.log("Williams?",result.result)

        if(result && !result.error && result.result){

            let records: any[] = result.result;
            setCurrentDataPage(records);
            setCurrentPage(page);
            setCountRegisters(result.count);

        }else{
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log("Erroraso",error);
        }
    }

    const returnCallback = (type: string) => {
        callback({
            tipo: type
        });
    }

    return(<>
        <CardContent sx={{ paddingBottom: 0 }}>
            <Grid container spacing={5}>
                <Grid item xs={12}>

                    <Card>
                            <CardHeader title='Comentarios' />
                            <CardContent>
                                <Grid container spacing={6}>
                                    {/* Nombres */}
                                    <Grid item xs={4} sm={4}>                                        
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                </Grid>

                <Grid item xs={12}>
                    <Card>
                            <DataGrid
                                autoHeight
                                rows={currentDataPage}
                                checkboxSelection
                                pageSize={pageSize}
                                disableSelectionOnClick
                                columns={defaultColumns}
                                rowsPerPageOptions={[10, 25, 50]}
                                onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                                page={currentPage}
                                onPageChange={newPage => getPage(newPage)}
                                rowCount={countRegisters}
                            />
                        </Card>
                </Grid>

                <Grid item xs={12}>
                    <Button variant='contained' onClick={() => returnCallback('anterior')} sx={{ marginRight: 3.5 }}>
                        Anterior
                    </Button>
                </Grid>

            </Grid>
        </CardContent>    
    </>)

}

export default TabComentarios