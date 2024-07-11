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
import { DocumentoData } from 'src/interfaces/objects/DocumentoData'
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
import ModalDocumento from 'src/pages/components/modalDocumento'
import ModalConfirmarDocumento from 'src/pages/components/modalConfirmarDocumento'

//import PlatilloService from 'src/services/PlatilloService'
import DocumentoService from 'src/services/DocumentoService'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import Check from 'mdi-material-ui/Check'
import Close from 'mdi-material-ui/Close'
import toast from 'react-hot-toast'

import { getInitials } from 'src/@core/utils/get-initials'

const service = new UserService();
//const PLATILLOSERVICE = new PlatilloService()
const documentoService = new DocumentoService()

interface State {

}

interface Props {
    UsuarioId: number
}

interface CellType {
    row: DocumentoData,
}


  // ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
    marginRight: theme.spacing(3)
  }))
  
const RowOptions = ({ id, validado, imagen }: { id: number | string, validado: boolean, imagen: string }) => {
  
     // ** State
     const [validadoState, setValidadoState] = useState<boolean>(validado)
     const [openModalConfirmar, setOpenModalConfirmar] = useState<boolean>(false)
  
     // ** Hooks
  
    //Handle modal callback
    const handleCallbackModal = (validado: boolean) => {
        if(validado){
            handleRowOptionsRedirect()
        }
    }

     // Redirect to edit
     const handleRowOptionsRedirect = async () => {
        //console.log("ID DE DOCUMENTO", id)

        let data = {
            documentoId: id,
            validado: !validadoState
        }

        let result = await documentoService.changeStatusDocumento(data)

        if(result && !result.error && result.result){
            toast.success(result.mensaje)
            setValidadoState(result.result.validado)
            setOpenModalConfirmar(false)
        }else{
            toast.error(result.mensaje)
        }

     }

     const openImage = () => {
        window.open(imagen, '_blank')
    }
  
     return (
         <>
            {
                openModalConfirmar && <ModalConfirmarDocumento
                    callback={handleCallbackModal}
                    handleClose={() =>  setOpenModalConfirmar(false)}
                    validado={validadoState}                    
                />
            }
            <IconButton size='small' onClick={() => setOpenModalConfirmar(true)} >
                {
                    validadoState ? <Close fontSize='small' sx={{ mr: 2 }} /> : <Check fontSize='small' sx={{ mr: 2 }} />
                }
            </IconButton>
            {<IconButton size='small' onClick={openImage}>
                <EyeOutline fontSize='small' sx={{ mr: 2 }} />
            </IconButton>}
         </>
     )
}

const defaultColumns = [
    // Nombre
    {
        flex: 0.25,
        minWidth: 230,
        field: 'name',
        headerName: 'Nombre',
        renderCell: ({ row }: CellType) => {

        return (
            <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {row.nombre}
            </Typography>
            )
        }
    },

        // Tipo
    {
        flex: 0.25,
        field: 'tipo',
        minWidth: 250,
        headerName: 'Tipo',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                    {row.tipo.toUpperCase()}
                </Typography>
            )
        }
    },

        // Validado por
    {
        flex: 0.2,
        minWidth: 150,
        headerName: 'Validado Por',
        field: 'currentPlan',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap sx={{ textTransform: 'capitalize' }}>
                    {row.UsuarioValidadorId && row.UsuarioValidador ? row.UsuarioValidador.nombreP + ' ' + row.UsuarioValidador.apellido : 'N/A'}
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
            return row.id ? <RowOptions id={row.id} validado={row.validado} imagen={row.imagen}/> : <></>
        },
    }
]

const TabPlatillosList = ({ UsuarioId } : Props) => {
    const [search, setSearch] = useState<string|undefined>(undefined)

    const [countRegisters, setCountRegisters] = useState<number>(0)
    const [currentDataPage, setCurrentDataPage] = useState<any>([])
    const [openModalCrear, setOpenModalCrear] = useState<boolean>(false)
    const [nombreUsuario, setNombreUsuario] = useState<string>('')
    const [rolUsuario, setRolUsuario] = useState<number>(0)
    const router = useRouter()

    useEffect(()=>{
        getDocumentos(1)
        getUser()
    },[])

    const getDocumentos = async(page:number=0) =>{
        let query = '?';
        //query += `page=${page}`;
        //query += `&size=${pageSize}`;
        //query += `&CocineroId=${UsuarioId}`
        if(search) query += `&search=${search}`;
        //query += `&size=${UsuarioId}`

        let result = await documentoService.getDocumentosUser(UsuarioId, query)

        if(result && !result.error && result.result){

            let records = result.result;
            setCurrentDataPage(records);
            setCountRegisters(result.count);

        }else{
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log("Erroraso",error);
        }
    }

    const getUser = async () => {
        if(UsuarioId){
            let result = await service.getAccount(UsuarioId);
            if(result && !result.error && result.result){
                // Catch al data of model
                setNombreUsuario(result.result.nombre)
                setRolUsuario(result.result.RolesUsuario[0].RolId)
                console.log("RESULTADO", result.result.RolesUsuario[0].RolId)
            } else {
                let error = `Error al obtener datos: ${result.mensaje}`;
                console.log(error);
            }
        }
    }

    const nuevoDocumento = () =>{
        setOpenModalCrear(true)
    }

    const handleCallbackModal = (result: any) =>{
        setOpenModalCrear(false)

        if(result){
            setCurrentDataPage([
                ...currentDataPage,
                result.result
            ])

            toast.success(result.message)
        } else{
            toast.error(result.message)
        }

    }

    return(<>
        { 
            openModalCrear && <ModalDocumento
                callback={handleCallbackModal}
                handleClose={() =>  setOpenModalCrear(false)}
                title="Crear nuevo documento"
                usuarioId={UsuarioId}
                nombreUsuario={nombreUsuario}
                rolUsuario={rolUsuario}
                toast={toast}
            />
        }
        <CardContent sx={{ paddingBottom: 0 }}>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='Filtros de Documentos' />
                        <CardContent>
                            <Grid container spacing={6}>
                                {/* Nombres */}
                                <Grid item xs={4} sm={4}>
                                    <FormControl fullWidth>
                                        <TextField
                                            label='Tipo de documento'
                                            value={search}
                                            onChange={(value) => {setSearch(value.target.value)}}
                                            error={false}
                                            placeholder='Buscar...'
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item sm={4} xs={12}>
                                    <Button variant='contained' type='submit' onClick={() => getDocumentos()} sx={{ marginRight: 3.5 }}>
                                        Buscar
                                    </Button>
                                    <Button variant='contained' type='submit' onClick={() => nuevoDocumento()} sx={{ marginRight: 3.5 }}>
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
                            disableSelectionOnClick
                            columns={defaultColumns}
                            rowCount={countRegisters}
                        />
                    </Card>
                </Grid>
            </Grid>                    

        </CardContent>
    </>)
}


export default TabPlatillosList