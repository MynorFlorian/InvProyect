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
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import RolesService from 'src/services/RoleServices'
import PlatilloService from 'src/services/PlatilloService'
import { RolData } from 'src/interfaces/objects/RolData'
import { CategoriaData } from 'src/interfaces/objects/CategoriaData'

// Services
const servicePlatillo = new PlatilloService();

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import UserService from 'src/services/UserService'
import LoginService from 'src/services/LoginService'
import { Checkbox, FormControlLabel, FormHelperText, ImageList } from '@mui/material'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'
import { RolUsuarioData } from 'src/interfaces/objects/RolUsuarioData'
import { UploadOutline, Download, Delete, DeleteForever } from 'mdi-material-ui'
import ModalUploadImages from 'src/pages/components/modalUploadImages'
import ModalDeletePlatillo from 'src/pages/components/modalDeletePlatillo'

const userService = new UserService()

// Default values to display
const defaultValues = {
    nombre: '',
    costoFijo: 0,
    descripcion: '',

    CategoriaId: undefined,
    showApp: false,
}

interface TabProps {
    UsuarioId?: number,
    platilloId?: any,
    callback?: any,
    dataPlatillo?: any,
    publica?: boolean,
}

const TabPlatillo = (props: TabProps) => {

    // Globals

    // ** State
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')
    const [openModalUpload, setOpenModalUpload] = useState<boolean>(false)

    // List's
    const [categorias, setCategorias] = useState<CategoriaData[]|undefined>(undefined);
    const [platilloImages, setPlatilloImages] = useState<any[]>([])
    const [platillo, setPlatillo] = useState<any>()
    const [file, setFile] = useState<any>()
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
    const [showApp, setShowApp] = useState<boolean>(false)

    // Loading data
    useEffect(() => {
        getCategorias();
        /*if(UsuarioId) {
            getUser();
        }*/
        /*if(PlatilloId) {
            getPlatillo();
        }*/

        if(props.dataPlatillo) {
            console.log(props.dataPlatillo);
            reset({
                nombre: props.dataPlatillo.nombre,
                costoFijo: props.dataPlatillo.costoFijo,
                descripcion: props.dataPlatillo.descripcion,
                CategoriaId: props.dataPlatillo.CategoriaId,
            });

            setPlatillo(props.dataPlatillo);
            setShowApp(props.dataPlatillo?.showApp);

            if(props.dataPlatillo.imagenes) {

                console.log(props.dataPlatillo.imagenes);
                //validate if is json or array
                if(typeof props.dataPlatillo.imagenes === 'string') {
                    setPlatilloImages(JSON.parse(props.dataPlatillo.imagenes));
                } else {
                    setPlatilloImages(props.dataPlatillo.imagenes);
                }

            }
        }

    }, [])

    const {
        control,
        formState: { errors },
        getValues,
        setValue,
        reset,
    } = useForm({
        defaultValues,
        mode: 'onBlur',
    })

    // Create Record
    const returnPlatilloData = () => {

        let values = getValues()
        values.showApp = showApp;

        if(!values.CategoriaId){
            //alert("Seleccione una categoria.")
            setMessageAlert('Seleccione una categoria.')
            setOpenAlert(true)
        }else if(!values.nombre){
            //alert("Ingrese un nombre para el platillo.")
            setMessageAlert('Ingrese un nombre para el platillo.')
            setOpenAlert(true)
        }else if(!values.costoFijo){
            //alert("Ingrese un costo fijo.")
            setMessageAlert('Ingrese un costo fijo.')
            setOpenAlert(true)
        }else{
            props.callback(values, platilloImages);
        }

    }

    // Modal change status cook
    const changeModalDelete = () =>{
        setOpenModalDelete((e)=>{
            return true
        })
    }

    // Get List
    const getCategorias = async () => {
        let result = await servicePlatillo.getCategorias();
        if(result && !result.error && result.result){
            let categorias: CategoriaData[] = result.result;
            setCategorias(categorias);
        } else {
            let error = `Error al obtener datos: ${result.mensaje}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }
    }

    function deleteImagePlatillo(item:any, index:number){
        let platilloAuxiliar = platillo
        let imagesAuxiliar = platilloImages

        if(!imagesAuxiliar || imagesAuxiliar.length < 1){
            imagesAuxiliar = []
        }

        if(imagesAuxiliar && index < imagesAuxiliar.length){
            delete imagesAuxiliar[index]
            imagesAuxiliar.splice(index,1)
        }

        imagesAuxiliar = [...imagesAuxiliar]
        setPlatilloImages(imagesAuxiliar)

        platilloAuxiliar.imagenes = JSON.stringify(platilloImages)
        setPlatillo({...platilloAuxiliar})
    }

    function renderImageList(item:any, index:any){
        console.log("Colecta",item)

        //Check if uri contains aws bucket
        let uri = item.uri
        if(uri && uri.includes('http://Inventario-bucket.s3-website-us-east-1.amazonaws.com/')){
            uri = uri.replace('http://Inventario-bucket.s3-website-us-east-1.amazonaws.com/','https://s3.amazonaws.com/Inventario-bucket')
        }

        return(<>
            <ImageListItem >
                <img
                    src={`${item.uri}`}
                    srcSet={`${item.uri}`}
                    loading="lazy"
                />

                <ImageListItemBar
                    title={item.title}
                    subtitle={item.author}
                    actionIcon={<>
                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${item.title}`}
                                onClick={()=> console.log(index)}
                                href={`${item.uri}`}
                            >
                                <Download />
                            </IconButton>

                            <IconButton
                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                aria-label={`info about ${item.title}`}
                                onClick={()=> deleteImagePlatillo(item, index)}

                            >
                                <Delete />
                            </IconButton>
                        </>
                    }
                />

            </ImageListItem>
        </>)
    }

    function renderImageUpload(){
        return(

            <ImageListItem
                style={{
                    cursor: 'pointer',
                }}
                onClick={() => setOpenModalUpload(true)}
            >
                <img
                    src="/images/Inventario/addimg.png"
                    srcSet="/images/Inventario/addimg.png"

                />
            </ImageListItem>
        )
    }

    const getImagesFromModal = (images:any) => {
        //setPlatilloImages
        setOpenModalUpload(false)
        setPlatilloImages([...platilloImages, ...images])
    }

    const alert = (mensaje:any) =>{
        setMessageAlert(mensaje);
        setOpenAlert(true);
    }


    return (
    <>

        <CardContent>
            <form noValidate autoComplete='off'>
                {/* Crear y editar platillo */}
                {
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
                                                label='Nombre Platillo'
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

                        {/* Costo */}
                        <Grid item xs={12} sm={2}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='costoFijo'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Costo'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={false}
                                                placeholder=''
                                            />
                                        )}
                                    />
                                    {   errors.costoFijo && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese un costo valido e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                        </Grid>

                        {/* Categoría */}
                        {
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='CategoriaId'
                                        control={control}
                                        rules={{ required: true }}
                                        defaultValue={props.dataPlatillo?.CategoriaId ? props.dataPlatillo.CategoriaId : undefined}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <>
                                                <InputLabel>Categoría</InputLabel>
                                                <Select label='Categoría' defaultValue={value} onChange={(event) => { onChange(event);}}>
                                                    {
                                                        categorias ?
                                                        categorias.map((item: CategoriaData, index: number) => {
                                                            return <MenuItem key={`cat-${index}`} value={item.id}>{item.nombre}</MenuItem>
                                                        })
                                                        :
                                                        null
                                                    }
                                                </Select>
                                            </>

                                        )}
                                    />
                                    {   errors.CategoriaId && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Seleccione una categoría e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        }

                        {/* Descripción */}
                        <Grid item xs={12} sm={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
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
                                                multiline
                                                rows={4}
                                            />
                                        )}
                                    />
                                    {   errors.descripcion && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese una descripción válida e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                        </Grid>

                        {/* Mostrar en app */}
                        {
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='showApp'
                                        control={control}
                                        rules={{ required: false }}
                                        defaultValue={showApp ? 'true' : 'false'}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <>
                                                <InputLabel>Mostrar en app movil?</InputLabel>
                                                <Select label='Categoría' value={showApp ? 'true' : 'false'} onChange={(event) => { setShowApp(!showApp) }}>
                                                    <MenuItem key={`show-app-true`} value={'true'}>Si</MenuItem>
                                                    <MenuItem key={`show-app-false`} value={'false'}>No</MenuItem>
                                                </Select>
                                            </>

                                        )}
                                    />
                                    {   errors.CategoriaId && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Seleccione una opcion valida e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        }

                        {!props.publica ? ( <Grid item xs={12} sm={12}>
                            {

                                <>
                                    <ImageList cols={6}>
                                        {
                                            renderImageUpload()
                                        }
                                        {
                                            platilloImages.length > 0 ?
                                            <>
                                                {
                                                    platilloImages && (platilloImages.length > 0) &&
                                                    platilloImages.map((item, index) => renderImageList(item, index))
                                                }
                                            </> : null
                                        }

                                    </ImageList>

                                    {/*<IconButton  htmlFor='upload-imgs' component='label'

                                        style={{
                                            backgroundColor: globalColors.greenInventario,
                                            borderRadius: 5,
                                            color: globalColors.blanco,
                                            width: '100%'
                                        }}
                                    >

                                        <UploadOutline />
                                        <input

                                            hidden
                                            id='upload-imgs'
                                            type='file'
                                            onChange={uploadFile}
                                        />


                                    </IconButton>*/}
                                </>
                            }

                        </Grid> ) : null}

                        {/* Upload modal */}
                        {
                            openModalUpload &&
                            <ModalUploadImages
                                handleClose={() => setOpenModalUpload(false)}
                                callback={getImagesFromModal}
                                platilloId={props.platilloId}
                                oldImages={platilloImages}
                            />
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

                                <Button variant='contained' onClick={() => returnPlatilloData()} sx={{ marginRight: 3.5 }}>
                                    Siguiente
                                </Button>

                                <Button variant="outlined" color="error" onClick={() => changeModalDelete()} startIcon={<DeleteForever />}>
                                    Eliminar Platillo
                                </Button>

                            {
                                /*!UsuarioId ?
                                <Button variant='contained' onClick={() => createUser()} sx={{ marginRight: 3.5 }}>
                                    Crear Platillo
                                </Button>
                                :
                                <Button variant='contained' onClick={() => updateUser()} sx={{ marginRight: 3.5 }}>
                                    Guardar Cambios
                                </Button>
                                */
                            }
                        </Grid>
                    </Grid>
                }

            </form>
        </CardContent>
        {
            openModalDelete && <ModalDeletePlatillo
                show={openModalDelete}
                nombre= {props.dataPlatillo.nombre}
                userId = {props.platilloId}
                handleClose={() =>  setOpenModalDelete(false)}
                handleAlert = { (mensaje:string)=> alert(mensaje)}
            />
        }
    </>
    )
}

export default TabPlatillo
