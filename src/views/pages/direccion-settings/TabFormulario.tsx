// ** React Imports
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'
import { useRouter } from 'next/router'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import RolesService from 'src/services/RoleServices'
import { RolData } from 'src/interfaces/objects/RolData'

import { getInitials } from 'src/@core/utils/get-initials'
import { DireccionesService } from 'src/services/DireccionesService'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import UserService from 'src/services/UserService'
import LoginService from 'src/services/LoginService'
import { FormHelperText } from '@mui/material'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'
import { RolUsuarioData } from 'src/interfaces/objects/RolUsuarioData'
import { DireccionData } from 'src/interfaces/objects/DireccionData'

const service = new DireccionesService()

const defaultValues = {
    descripcion:"",
    notas: "",
    titulo:"",
    direccionSeleccionada: false,
    longitud:"",
    latitud:"",
    UsuarioId:0,
    Usuario:undefined
}
interface Props{
    DireccionId: number,
    tipo:boolean //1: Crear; 0: Editar
}

const TabDireccion = (props: Props) =>{
    // Globals
    const router = useRouter()
    const auth = useAuth();

    // ** State
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')
    const [direccion, setDireccion] = useState<DireccionData>()
    
    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue
    } = useForm({
        defaultValues,
        mode: 'onBlur',
    })
    
    useEffect(()=>{

        if(!props.tipo){
            getDireccion()
        }

    },[])
    
    const getDireccion = async ()=>{
        if(props.DireccionId){
            let res = await service.getDireccion(props.DireccionId)

            if(res && !res.error){

                let data:DireccionData = {
                    descripcion: res.result.descripcion,
                    latitud: res.result.latitud,
                    longitud: res.result.longitud,
                    direccionSeleccionada: res.result.direccionSeleccionada,
                    notas: res.result.notas,
                    titulo: res.result.titulo,
                    Usuario: res.result.Usuario,
                    UsuarioId: res.result.UsuarioId
                }

                for(let key in res.result){
                    if(res.result[key]) {
                        //@ts-ignore
                        setValue(key, res.result[key]);
                    }
                }


                setDireccion((e)=>{
                    return data
                })

            }else{
                alert("Error recolectando datos de direccion, revisar rapido.")
            }
        }
    }

    const updateDireccion = async() =>{

        let values: any = getValues();

        let result = await service.updateDireccion(props.DireccionId, values)

        
        //console.log(values)

        if(result && !result.error){
            console.log(result)
            router.back()
        }else{
            let error = `Error al editar direccion: ${result.mensaje}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }



    }

    const createDireccion = async() =>{
        let values:any = getValues()

        let result = await service.createDireccion(values)

        if(result && !result.error){

            router.back()
        }else{
            let error = `Error al editar direccion: ${result.mensaje}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }
    }


    return(<>
        <CardContent>
            <form noValidate autoComplete='off'>
                {
                    auth.isAdmin() ?
                    <Grid container spacing={7}>


                        {/**Titulo de la direccion */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='titulo'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Titulo de la direccion'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={false}
                                                placeholder=''
                                            />
                                        )}
                                    />
                                    {   errors.titulo && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese un nombre valido e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                            </FormControl>
                        </Grid>

                        
                        {/**Descripcion */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='descripcion'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Descripcion de la direccion'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={false}
                                                placeholder=''
                                            />
                                        )}
                                    />
                                </FormControl>
                        </Grid>

                        {/**Notas */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='notas'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Notas de la direccion'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={false}
                                                placeholder=''
                                            />
                                        )}
                                    />
                                    {   errors.notas && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingresa las notas de dirección, sera mas facil encontrarte.'}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                        </Grid>                        

                        <Grid item xs={12}>
                            {
                                props.tipo ?
                                <Button variant='contained' onClick={() => createDireccion()} sx={{ marginRight: 3.5 }}>
                                    Crear Direccion
                                </Button>
                                :
                                <Button variant='contained' onClick={() => updateDireccion()} sx={{ marginRight: 3.5 }}>
                                    Guardar Cambios
                                </Button>
                            }
                        </Grid>
                    </Grid>
                    : null
                }
            </form>
        </CardContent>
    </>)

}

export default TabDireccion