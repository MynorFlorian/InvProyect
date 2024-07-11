// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

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
import { Statics } from 'src/utils/statics'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import RolesService from 'src/services/RoleServices'
import { RolData } from 'src/interfaces/objects/RolData'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

// Services
const usersService = new UserService();

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import UserService from 'src/services/UserService'
import LoginService from 'src/services/LoginService'
import { FormHelperText, ImageListItem } from '@mui/material'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'
import { RolUsuarioData } from 'src/interfaces/objects/RolUsuarioData'
import { DeleteForever, UploadOutline } from 'mdi-material-ui'

// Default values to display
const defaultValues = {
    nombre: '',
    descripcion: '',
    imagen: '',
}

interface FormData {
    id?: number;
    nombre: string;
    descripcion?: string;
    imagen?: string;
}

interface TabProps {
    CategoriaId?: number,
}

const TabCategoria = (props: TabProps) => {

    // Globals
    const router = useRouter()
    const auth = useAuth();

    // ** State
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')
    const [nombreCategoria, setNombreCategoria] = useState<string>('Categoria')
    const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

    const [CategoriaId, setCategoriaId] = useState<number|undefined>(props.CategoriaId)

    // Modal confirmacion de eliminaicon
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
    const [file, setFile] = useState<any>();

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

    // Loading data
    useEffect(() => {
        if(CategoriaId) {
            getRecord();
        }
    }, [CategoriaId])

    // Get Record
    const getRecord = async () => {
        if(CategoriaId){
        }
    }

    // Create Record
    const create = async () => {
        let values:any = getValues();
    }

    // Create Record
    const update = async () => {
        let values: any = getValues();

    }

    // Modal change status cook
    const changeModalDelete = () =>{
        setOpenModalDelete((e)=>{
            return true
        })
    }

    const alert = (mensaje:any) =>{
        setMessageAlert(mensaje);
        setOpenAlert(true);
    }

    const uploadFile = async (file: any) =>{
        const reader = new FileReader()

        const {files} = file.target as HTMLInputElement

        if(files && files.length > 0){
            let file = files[0]
            let  resultUpload = await usersService.uploadFile(file)
            if(!resultUpload.error && resultUpload.result){
                let fileToSave = {
                    uri: resultUpload.result,
                    name: file.name,
                    type: file.type
                }

                setFile((e:any)=>{
                    return fileToSave.uri})
            }
        }

    }

    return (<>
        <CardContent>
            <form noValidate autoComplete='off'>
                <Grid container spacing={7}>

                    {/* Nombre */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='nombre'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Nombre de categoría'
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            error={false}
                                            placeholder=''
                                        />
                                    )}
                                />
                                {   errors.nombre && (
                                    <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                        {'Ingrese un nombre valido e intente de nuevo.'}
                                    </FormHelperText>
                                )}
                        </FormControl>
                    </Grid>

                    {/* Descripción */}
                    {
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <Controller
                                    name='descripcion'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Descripción'
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            error={false}
                                            placeholder=''
                                        />
                                    )}
                                />
                                {   errors.descripcion && (
                                    <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                        {'Ingrese una descripcion e intente de nuevo.'}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    }

                    {/* Imagen de categoría */}
                    {
                        <Grid item xs={12} sm={6}>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    {/* <TextField
                                        disabled
                                        value={file ? file: 'Sube una imagen.'}
                                        style={{
                                            marginRight: 17
                                        }}
                                    /> */}

                                    {
                                        //file &&
                                        <img
                                            src={`${imgSrc}`}
                                            loading="lazy"
                                            style={{
                                                width: 200,
                                                height: 300,
                                                objectFit: 'cover'
                                            }}
                                        />
                                    }

                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <IconButton  htmlFor='upload-img' component='label'
                                        style={{
                                            backgroundColor: globalColors.greenInventario,
                                            borderRadius: 5,
                                            color: globalColors.blanco,
                                            width: '50%'
                                        }}
                                    >
                                        <UploadOutline />
                                        <input
                                            hidden
                                            id='upload-img'
                                            type='file'
                                            onChange={uploadFile}
                                        />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    {/* Alert */}
                    {openAlert ? (
                        <Grid item xs={12} sx={{ mb: 3 }}>
                            <Alert
                                severity='warning'
                                sx={{ '& a': { fontWeight: 400 } }}
                                action={
                                <IconButton size='small' color='inherit' aria-label='close' onClick={() => setOpenAlert(false)}>
                                    <Close fontSize='inherit' />
                                </IconButton>
                                }
                            >
                                <AlertTitle>{messageAlert}</AlertTitle>
                            </Alert>
                        </Grid>
                    ) : null}

                    <Grid item xs={12}>
                        {
                            !CategoriaId
                            ?
                                <Button variant='contained' onClick={() => create()} sx={{ marginRight: 3.5 }}>
                                    Crear Categoria
                                </Button>
                            :
                                <Grid xs={12} container>
                                    <Grid item xs={8} sm={6}>
                                        {/* Button guardar cambios */}
                                        <Button variant='contained' onClick={() => update()} sx={{ marginRight: 3.5 }}>
                                            Guardar Cambios
                                        </Button>
                                    </Grid>
                                    <Grid xs={4} item>
                                        <Button variant="outlined" color="error" onClick={() => changeModalDelete()} startIcon={<DeleteForever />}>
                                            Eliminar
                                        </Button>
                                    </Grid>
                                </Grid>
                        }
                    </Grid>
                </Grid>
            </form>
        </CardContent>
    </>)
}

export default TabCategoria
