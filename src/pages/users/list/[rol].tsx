// ** React Imports
import { useState, useEffect, useCallback, ReactElement } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icons Imports
import PencilOutline from 'mdi-material-ui/PencilOutline'

// ** Store Imports

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import { RolData } from 'src/interfaces/objects/RolData'
import RolesService from 'src/services/RoleServices'
import UserService from 'src/services/UserService'
import { UserData } from 'src/interfaces/objects/UserData'
import { useRouter } from 'next/router'
import { Button, TextField } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { Statics } from '../../../utils/statics';

interface UserRoleType {
  [key: string]: ReactElement
}

interface UserStatusType {
  [key: string]: ThemeColor
}

// ** Vars

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
       router.push(`/users/${id}`);
   }

   return (
       <>
           <IconButton size='small' onClick={handleRowOptionsRedirect}>
               <PencilOutline fontSize='small' sx={{ mr: 2 }} />
           </IconButton>
       </>
   )
}

// ** renders client column
const renderClient = (fullName: string) => {
    if (false) {
        return (
        <AvatarWithImageLink href={`/`}>
            <CustomAvatar src={''} sx={{ mr: 3, width: 30, height: 30 }} />
        </AvatarWithImageLink>
        )
    } else {
        return (
            <CustomAvatar
            skin='light'
            color={'primary'}
            sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
        >
            {getInitials(fullName)}
        </CustomAvatar>
        )
    }
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
            {renderClient(fullName)}
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

    // Correo
    {
        flex: 0.25,
        field: 'telefono',
        minWidth: 150,
        headerName: 'Telefono',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                {row.telefono}
                </Typography>
            )
        }
    },

    // Rol
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Rol',
        field: 'currentPlan',
        renderCell: ({ row }: CellType) => {
            let rol = row.RolesUsuario && row.RolesUsuario.length > 0 ? row.RolesUsuario[0].Rol : null;
            return (
                rol ?
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {rol.nombre}
                </Typography>
                :
                null
            )
        }
    },

    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Fecha de Creación',
        field: 'fechaCreacion',
        renderCell: ({ row }: CellType) => {
            let fecha =new Date(row.createdAt)
            return (
                fecha ?
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {fecha.toLocaleDateString()} {(fecha.getHours()<10) ? '0'+fecha.getHours():fecha.getHours()}:{(fecha.getMinutes()<10) ? '0'+fecha.getMinutes() : fecha.getMinutes()}
                </Typography>
                :
                null
            )
        }
    },

    // País
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'País',
        field: 'pais',  // Agregar field
        renderCell: ({ row }: CellType) => {
            const territorio = row.Territorio;
            const pais = territorio ? Statics.instance.paises.find((item: any) => item.nombre === territorio.pais)?.label || territorio.pais : '';

            return (
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {pais}
                </Typography>
            );
        }
    },
    // Región
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Región',
        field: 'region',
        renderCell: ({ row }: CellType) => {
            const territorios = row.Territorio;

            const findRoot = (territorio: any) => {
                while (territorio?.ParentTerritorio) {
                    territorio = territorio.ParentTerritorio;
                }
                return territorio;
            };

            const rootTerritorio = findRoot(territorios);
            const nombreRaiz = rootTerritorio?.nombre || '';

            return (
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {nombreRaiz}
                </Typography>
            );
        }
    },

    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Estatus',
        field: 'status',
        renderCell: ({ row }: CellType) => {
            let status = row.statusRegistro;
            return (
                status ?
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {status}
                </Typography>
                :
                null
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

const influencerColumns = [
    ...defaultColumns.slice(0, defaultColumns.length - 1),
    // Referidos
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Referidos',
        field: 'currentReferidos',
        renderCell: ({ row }: CellType) => {
            let referidos = row.UsuariosReferidos && row.UsuariosReferidos.length > 0 ? row.UsuariosReferidos[0].totalReferidos : 0;
            return (
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {referidos}
                </Typography>
            )
        }
    },
    // Visualizaciones
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Visualizaciones',
        field: 'currentVisualizaciones',
        renderCell: ({ row }: CellType) => {
            let visualizaciones = row.Visualizaciones && row.Visualizaciones.length > 0 ? row.Visualizaciones[0].totalVisualizaciones : 0;
            return (
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {visualizaciones}
                </Typography>
            )
        }
    },
    defaultColumns[defaultColumns.length - 1],
]

const UserList = () => {
    // ** State
    const [value, setValue] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [pageSize, setPageSize] = useState<number>(10)
    const [countRegisters, setCountRegisters] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [currentDataPage, setCurrentDataPage] = useState<UserData[]>([])
    const router = useRouter()
    const { rol, configuration } = router.query;

    //  ** Filters
    const [RolId, setRolId] = useState<number|undefined>(undefined)
    const [search, setSearch] = useState<string|undefined>(undefined)

    // * Hooks *
    const auth = useAuth();

    // Services
    const serviceRoles = new RolesService();
    const service = new UserService();

    // List's
    const [roles, setRoles] = useState<RolData[]|undefined>(undefined);

    // List of status register
    const [statusRegistro, setStatusRegistro] = useState(Statics.instance.statusRegistro)
    const [statusRegistroId, setStatusRegistroId] = useState<string|undefined>(undefined)
    const notStatusRegistro = 'Ningún Estado'


    // Loading data
    useEffect(() => {
        getRoles();
        getPage(0);
    }, [rol])

    // Get List
    const getRoles = async () => {
        let result = await serviceRoles.get();
        //console.log(result);
        if(result && !result.error && result.result){
            let roles: RolData[] = result.result;
            setRoles(roles);
        } else {
            let error = `Error al obtener datos: ${result.message}`;
            // await setMessageAlert(error);
            // setOpenAlert(true);
            console.log(error);
        }
    }

    // Get Page
    const getPage = async (page: number) => {
        // Query
        let query = '?';
        query += `page=${page}`;
        query += `&size=${pageSize}`;

        if(RolId) query += `&RolId=${RolId}`;

        let rolName = '';

        if(rol == 'cocineros' || rol == 'priococineros'){
            rolName = 'Cocinero';
        }else if(rol == 'clientes'){
            rolName = 'Cliente';
        }else if(rol == 'repartidores'){
            rolName = 'Delivery';
        }else if(rol == 'influencers'){
            rolName = 'Influencer';
        }

        if(rol) query += `&rol=${rolName}`;
        if(search) query += `&search=${search}`;
        if(statusRegistroId) query += `&statusRegistroId=${statusRegistroId}`;
        if(configuration) query += `&configuration=${configuration}`

        console.log('query', query)

        let result = await service.getAll(query);
        console.log(pageSize, page, result.result)

        if(result && !result.error && result.result){
            let records: UserData[] = result.result;
            setCurrentDataPage(records);
            setCurrentPage(page);
            setCountRegisters(result.count);
        } else {
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log(error);
        }
    }

    const handleChangePageSize = async (newPageSize:number) => {
        let query = '?';
        query += `page=${currentPage}`;
        query += `&size=${newPageSize}`;
        //if(RolId) query += `&RolId=${RolId}`;

        let rolName = '';

        if(rol == 'cocineros' || rol == 'priococineros'){
            rolName = 'Cocinero';
        }else if(rol == 'clientes'){
            rolName = 'Cliente';
        }else if(rol == 'repartidores'){
            rolName = 'Delivery';
        }


        if(rol) query += `&rol=${rolName}`;
        if(search) query += `&search=${search}`;
        if(statusRegistroId) query += `&statusRegistroId=${statusRegistroId}`;

        let result = await service.getAll(query);


        if(result && !result.error && result.result){
            let records: UserData[] = result.result;
            console.log(result.result)
            setPageSize(newPageSize);
            setCurrentDataPage(records);
            setCountRegisters(result.count);
        } else {
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log(error);
        }
    }

    // Filter Rol
    const handleRoleChange = useCallback((e: SelectChangeEvent) => {
        if(e.target.value && !isNaN(+e.target.value)) setRolId(+e.target.value);
    }, [])

    const handleStatusRegistroChange = useCallback((e: SelectChangeEvent) => {
        console.log(e.target.value)
        if(e.target.value === notStatusRegistro){
            setStatusRegistroId('');
        }else{
            setStatusRegistroId(e.target.value);
        }
    }, [])

    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Filtros de Usuarios' />
                    <CardContent>
                        <Grid container spacing={6}>
                            {/* Nombres */}
                            <Grid item xs={4} sm={4}>
                                <FormControl fullWidth>
                                    <TextField
                                        label='Nombre o Telefono'
                                        value={search}
                                        onChange={(value) => {setSearch(value.target.value)}}
                                        error={false}
                                        placeholder='Buscar...'
                                    />
                                </FormControl>
                            </Grid>

                            {/* Status Register Filter */}
                                { (rol == 'cocineros' || rol == 'priococineros') &&
                                    <Grid item sm={4} xs={4}>
                                        <FormControl fullWidth>
                                            <InputLabel>Estado de Registro</InputLabel>
                                            <Select label='Estado de Registro' defaultValue={notStatusRegistro} onChange={handleStatusRegistroChange} inputProps={{ placeholder: 'Seleccione un Estado' }}>
                                                <MenuItem key={`status-1`} value={notStatusRegistro}>{notStatusRegistro}</MenuItem>
                                                {
                                                    statusRegistro ?
                                                    statusRegistro.map((item: any, index: number) => {
                                                        return <MenuItem key={`status${index}`} value={item.id}>{item.descripcion}</MenuItem>
                                                    })
                                                    :
                                                    null
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                }


                            <Grid item sm={4} xs={12}>
                                <Button variant='contained' type='submit' onClick={() => getPage(0)} sx={{ marginRight: 3.5 }}>
                                    Buscar
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
                        columns={rol === 'influencers' ? influencerColumns : defaultColumns}
                        rowsPerPageOptions={[10, 25, 50]}
                        onPageSizeChange={newPageSize =>
                            handleChangePageSize(newPageSize)}
                        page={currentPage}
                        onPageChange={newPage => getPage(newPage)}
                        rowCount={countRegisters}
                        paginationMode = {'server'}
                    />
                </Card>
            </Grid>
        </Grid>
    )
}

export default UserList
