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

const service = new UserService();
const PLATILLOSERVICE = new PlatilloService()

interface State {

}

interface Props {
    UsuarioId: number
}

interface CellType {
    row: PlatilloData,
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
        const { nombre } = row
        const fullName = nombre;

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

        // Costo
    {
        flex: 0.25,
        field: 'number',
        minWidth: 250,
        headerName: 'Costo',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                {row.costoFijo} ₡
                </Typography>
            )
        }
    },

        // Descripcion
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Descripcion',
        field: 'currentPlan',
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

const TabPlatillosList = ({ UsuarioId } : Props) => {
    const [search, setSearch] = useState<string|undefined>(undefined)

    const [pageSize, setPageSize] = useState<number>(10)
    const [countRegisters, setCountRegisters] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [currentDataPage, setCurrentDataPage] = useState<PlatilloData[]>([])
    const router = useRouter()

    useEffect(()=>{
        getPage(0)
    },[])

    const getPage = async(page:number=0) =>{
        let query = '?';
        query += `page=${page}`;
        query += `&size=${pageSize}`;
        query += `&CocineroId=${UsuarioId}`
        if(search) query += `&search=${search}`;
        //query += `&size=${UsuarioId}`

        let result = await PLATILLOSERVICE.getUserPlatillos(query)

        if(result && !result.error && result.result){

            let records: PlatilloData[] = result.result;
            setCurrentDataPage(records);
            setCurrentPage(page);
            setCountRegisters(result.count);

        }else{
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log("Erroraso",error);
        }
    }

    const nuevoPlatillo = () =>{
        router.push(`/platillos/new/${UsuarioId}`);
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
                                            label='Nombre de platillo'
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
                                    <Button variant='contained' type='submit' onClick={() => nuevoPlatillo()} sx={{ marginRight: 3.5 }}>
                                        Nuevo
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* List of data */}
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


export default TabPlatillosList
