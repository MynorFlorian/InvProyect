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
import { RolData } from 'src/interfaces/objects/RolData'
import PromocionesEspService from 'src/services/PromocionesEspService'

const service = new PromocionesEspService()

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import { FormHelperText, ImageList, ImageListItem, ImageListItemBar } from '@mui/material'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'
import { RolUsuarioData } from 'src/interfaces/objects/RolUsuarioData'
import { Delete, Download, UploadOutline } from 'mdi-material-ui'
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/lab'
import DateTimePickers from 'src/views/forms/form-elements/pickers/mui-pickers/DateTimePickers'
import ModalUploadImages from 'src/pages/components/modalUploadImages'


const defaultValues = {
    titulo: '',
    descripcion: '',
    imagenes: '',
    reglas: '',
    fechaCreacion: new Date(),
    fechaVigencia: new Date(),
    status: 'Creado'
}

interface TabProps {
    PromocionId?:number,
}

const TabAccount = (props: TabProps) => {

    // Globals
    const router = useRouter()
    const auth = useAuth();

    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')

    const [openModalUpload, setOpenModalUpload] = useState<boolean>(false)
    const [promocion, setPromocion] = useState<any>()
    const [promocionImages, setPromocionImages] = useState<any[]>([])

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        reset
    } = useForm({
        defaultValues,
        mode: 'onBlur'
    })

    useEffect(() => {
        if(props.PromocionId){
            getPromosInformation()
        }
    },[])

    const getPromosInformation = async () =>{
        let result = await service.getPromocionEspecial(props.PromocionId ?? 0)

        if(result && !result.error){
            

            setPromocionImages(JSON.parse(result.result["imagenes"]))
            
            reset({
                titulo          : result.result.titulo,
                descripcion     : result.result.descripcion,
                fechaCreacion   : result.result.fechaCreacion,
                fechaVigencia   : result.result.fechaVigencia
            })
            
        }else{
            let error = `Error al crear promoción: ${result.message}`;
            await setMessageAlert(error);
            setOpenAlert(true);
        }
    }

    const updatePromocionEspecial = async () =>{
        let values:any = getValues()

        values.imagenes = promocionImages

        let result = await service.updatePromocion(Number(props.PromocionId) ?? 1, values)

        if(result && !result.error){
            alert("Se ha actualizado la promoción con exito.")
        }else{
            alert(result.message)
        }
    }

    const addNewPromocionEspecial = async () =>{
        let values:any = getValues()

        values.imagenes = JSON.stringify(promocionImages)

        
        let result = await service.createPromocion(values)

        console.log(result)
        if(result && !result.error){
            router.push('/')            
        }else{
            let error = `Error al crear promoción: ${result.message}`;
            await setMessageAlert(error);
            setOpenAlert(true);
        }

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
        setPromocionImages([...promocionImages, ...images])
        console.log(promocionImages)
    }

    function deleteImagepromocion(item:any, index:number){
        let promocionAuxiliar:any = promocion
        let imagesAuxiliar = promocionImages

        if(!imagesAuxiliar || imagesAuxiliar.length < 1){
            imagesAuxiliar = []
        }

        if(imagesAuxiliar && index < imagesAuxiliar.length){
            delete imagesAuxiliar[index]            
            imagesAuxiliar.splice(index,1)
        }

        imagesAuxiliar = [...imagesAuxiliar]
        setPromocionImages(imagesAuxiliar)

        promocionAuxiliar.imagenes = JSON.stringify(promocionImages)
        setPromocion({...promocionAuxiliar})
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
                                onClick={()=> deleteImagepromocion(item, index)}
                                
                            >
                                <Delete />
                            </IconButton>
                        </>
                    }
                />

            </ImageListItem>
        </>)
    }


    return(<>
        <CardContent>
            <form noValidate autoComplete='off'>
                {/* Solo para administradores */}
                {
                    auth.isAdmin() ? 
                    <Grid container spacing={7}>

                        {/* Titulo */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='titulo'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Titulo'
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

                        {/* Descripcion */}
                        <Grid item xs={12} sm={6}>
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
                                            />
                                        )}
                                    />
                                    {   errors.descripcion && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese un nombre valido e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                            </FormControl>                            
                        </Grid>

                        {/* Fecha de inicio */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='fechaCreacion'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <LocalizationProvider  dateAdapter={DateFnsUtils}>
                                                <DatePicker
                                                    onChange={onChange}
                                                    value={value}
                                                    label='Fecha de inicio'
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                    {   errors.fechaCreacion && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese un nombre valido e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                            </FormControl>                              
                        </Grid>                        
                        
                        {/* Fecha de expiración */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='fechaVigencia'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <LocalizationProvider  dateAdapter={DateFnsUtils}>
                                                <DatePicker
                                                    onChange={onChange}
                                                    value={value}
                                                    label='Fecha de expiración'
                                                    renderInput={(params) => <TextField {...params} />}
                                                />
                                            </LocalizationProvider>
                                        )}
                                    />
                                    {   errors.fechaVigencia && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese un nombre valido e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                            </FormControl>     
                        </Grid>
                        
                        {/* Reglas */}
                        <Grid item xs={12} sm={6}>
                            
                        </Grid>


                        {/* Status */}
                        {props.PromocionId && <Grid item xs={12} sm={6}>
                            
                        </Grid>}

                        {/* imagenes */}
                        <Grid item xs={12} sm={12}>
                                {
                                    <ImageList cols={6}>
                                        {
                                            renderImageUpload()
                                        }
                                        {
                                            promocionImages.length > 0 ? 
                                            <>
                                                {
                                                    promocionImages && (promocionImages.length > 0) &&
                                                    promocionImages.map((item, index) => renderImageList(item, index))
                                                }
                                            </> : null
                                        }
                                    </ImageList>
                                }
                        </Grid>



                        <Grid item xs={12}>
                            {
                                !props.PromocionId ?
                                <Button variant='contained' onClick={() => addNewPromocionEspecial()} sx={{ marginRight: 3.5 }}>
                                    Crear Promoción
                                </Button>
                                :
                                <Button variant='contained' onClick={() => updatePromocionEspecial()} sx={{ marginRight: 3.5 }}>
                                    Guardar Cambios
                                </Button>
                            }
                        </Grid>

                    </Grid>
                    : null
                }
            </form>
        </CardContent>

    {/* Upload modal */}
        {
            openModalUpload && 
            <ModalUploadImages
                handleClose={() => setOpenModalUpload(false)}
                callback={getImagesFromModal}
                platilloId={props.PromocionId}
                oldImages={promocionImages}
                updatePromocionesEspeciales
            />
        }
    </>)

}

export default TabAccount