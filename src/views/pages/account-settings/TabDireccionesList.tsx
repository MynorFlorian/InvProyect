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
import { DireccionesService } from 'src/services/DireccionesService'

const service = new UserService();
const direccionesService = new DireccionesService()

interface State {

}

interface Props{
    UsuarioId: number
}

interface CellType {
    row: any,
}

const RowOptions = ({id}:{id:number | undefined}) =>{

    // Globals
    const router = useRouter()
    // ** State
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    // ** Hooks

    // Redirect to edit
    const handleRowOptionsRedirect = () => {
        /**
        *   Se envian a la pagina de Direccion con su id
        */
        //router.push(`/users/${id}`);
        router.replace(`/direcciones/${id}`)

    }

    return (
        <>
            {<IconButton size='small' onClick={handleRowOptionsRedirect}>
                <PencilOutline fontSize='small' sx={{ mr: 2 }} />
            </IconButton>}
        </>
        )
}


const renderDireccion = (name:string) =>{
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
    // Direccion
    {
        flex: 0.25,
        minWidth: 230,
        field: 'titulo',
        headerName: 'Direccion',
        renderCell: ({ row }: CellType) => {
        const { titulo } = row
        const fullName = titulo;

        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderDireccion(fullName)}
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

        // Costo
    {
        flex: 0.25,
        minWidth: 250,
        field: 'notas',
        headerName: 'Notas de direcciónn',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                {row.notas}
                </Typography>
            )
        }
    },

        // Descripcion
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Descripcion',
        field: 'descripcion',
        renderCell: ({ row }: CellType) => {
            let rol = row.descripcion
            return (
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {rol}
                </Typography>
                
            )
        }
    },

    // Actions
    {
        flex: 0.15,
        minWidth: 75,
        sortable: false,
        field: 'actions',
        headerName: '',
        renderCell: ({ row }: CellType) => {
            return row.id ? <RowOptions id={row.id}/> : <></>
        },
    }
]

const TabDireccionesList = ({ UsuarioId } : Props) =>{

    const [search, setSearch] = useState<string|undefined>(undefined)

    const [pageSize, setPageSize] = useState<number>(10)
    const [countRegisters, setCountRegisters] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [currentDataPage, setCurrentDataPage] = useState<any[]>([])

    useEffect(()=>{
        getPage(1)
    },[])

    const getPage = async(page:number=0) =>{
        let query = '?';
        query += `page=${page}`;
        query += `&size=${pageSize}`;
        query += `&UsuarioId=${UsuarioId}`
        if(search) query += `&search=${search}`;

        let result = await direccionesService.getAllDirecciones(UsuarioId, query)

        if(result && !result.error && result.result){
            let records: any[] = result.result;
            setCurrentDataPage(records);
            setCurrentPage(page);
            setCountRegisters(result.count);
            console.log("Resultado ", result.result)
        }else{
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log("Erroraso",error);
        }
    }

    return(<>
        <CardContent sx={{ paddingBottom: 0 }}>
            <Grid container spacing={5}>
                <Grid item xs={12}>

                    <Card>
                        <CardHeader title='Filtros de Platillos' />
                            <CardContent>
                                <Grid container spacing={6}>
                                    {/* Nombres */}
                                    <Grid item xs={4} sm={4}>
                                        <FormControl fullWidth>
                                            <TextField
                                                label='Titulo de la direccion'
                                                value={search}
                                                onChange={(value) => {setSearch(value.target.value)}}
                                                error={false}
                                                placeholder='Buscar...'
                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item sm={4} xs={12}>
                                        <Button variant='contained' type='submit' onClick={() => getPage()} sx={{ marginRight: 3.5 }}>
                                            Buscar
                                        </Button>
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
            </Grid>
        </CardContent>
    </>)

}

export default TabDireccionesList