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
import Accordion from '@mui/material/Accordion'
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
import {AccountOutline, Information, Download, Delete} from 'mdi-material-ui'


// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import RolesService from 'src/services/RoleServices'
import { RolData } from 'src/interfaces/objects/RolData'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import UserService from 'src/services/UserService'
import LoginService from 'src/services/LoginService'
import { AccordionDetails, AccordionSummary, FormHelperText, ImageList } from '@mui/material'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'
import { RolUsuarioData } from 'src/interfaces/objects/RolUsuarioData'
import { UploadOutline } from 'mdi-material-ui'
import PlatilloService from 'src/services/PlatilloService'


const service = new PlatilloService()
const userService = new UserService()


const defaultValues = {
    nombre: '',
    descripcion: '',
    costoFijo: 0,
    imagenPrincipal: ''

}

interface TabProps {
    IdPlatillo?: number
}

const TabPlatilloEdit = (props: TabProps) =>{

    const [idPlatillo, setIdPlatillo] = useState<number|undefined>(props.IdPlatillo)
    const [platillo, setPlatillo] = useState<any>()
    const [messageAlert, setMessageAlert] = useState<string>('')
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [file, setFile] = useState<any>()
    const [platilloImages, setPlatilloImages] = useState<any[]>([])

    const [ingredientes, setIngredientes] = useState<any[]>([])

    let textInputControl:any = null

    // Globals
    const router = useRouter()
    const auth = useAuth();

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

    useEffect(() =>{
        getPlatilloInfo()
    },[])

    useEffect(() =>{
        console.log("Si entra imagenes", platilloImages)
    },[platilloImages])



    const getPlatilloInfo = async () =>{
        if(idPlatillo){
            let result = await service.getInformacionPlatillo(idPlatillo)
            
            if(result && !result.error){
                for(let key in result.result){
                    if(result.result[key]) {
                        //@ts-ignore
                        setValue(key, result.result[key]);
                        console.log(key)
                    }
                }

                setPlatilloImages(JSON.parse(result.result["imagenes"]))
                setPlatillo(result.result)
            } else {
                let error = `Error al obtener datos: ${result.mensaje}`;
                await setMessageAlert(error);
                setOpenAlert(true);
                console.log(error);
            }
        }
    }

    const validateDinamicArray = async (array: string, requiredKeys: any[], nameErrorMessage: string) =>{
        let platilloAuxiliar:any = platillo
        
        if (platilloAuxiliar && platilloAuxiliar[array] && Array.isArray(platilloAuxiliar[array]) && platilloAuxiliar[array].length > 0) {
            for (let item of platilloAuxiliar[array]) {
                for (let requiredKey of requiredKeys) {
                    let error = false;
                    // Validate type
                    switch (requiredKey.type) {
                        case 'string':
                            if (!item[requiredKey.key]) {
                                alert(`Por favor, ingrese ${requiredKey.name} valido para agregar ${nameErrorMessage}.`);
                                error = true;
                            }
                            break;
                        case 'number':
                            // Validation
                            if (isNaN(+item[requiredKey.key])) {
                                alert(`Por favor, ingrese ${requiredKey.name} valido para agregar ${nameErrorMessage}.`);
                                error = true;
                            }

                            // Validation
                            if ((+item[requiredKey.key]) <= 0) {
                                alert(`Por favor, ingrese ${requiredKey.name} valido para agregar ${nameErrorMessage}.`);
                                error = true;
                            }
                            break;
                        default:
                            error = true;
                            break;
                    }
                    if (error) return false;
                }
            }
        }
        return true;
    }

    const updateIngrediente = async(index: number, key: string, value: any) =>{
        console.log(value)
        
        let platilloAuxiliar:any = platillo

        console.log("update",platilloAuxiliar.IngredientesPlatillo)

        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.IngredientesPlatillo) platilloAuxiliar.IngredientesPlatillo = [];

        // Update specific ingrediente by index
        if (platilloAuxiliar.IngredientesPlatillo && index < platilloAuxiliar.IngredientesPlatillo.length) {
            platilloAuxiliar.IngredientesPlatillo[index][key] = value;
        }

        setPlatillo({...platilloAuxiliar})

    }

    
    const deleteIngrediente = (index:number, value:any) =>{
        
        let platilloAuxiliar1 = platillo


            if(platilloAuxiliar1 && !platilloAuxiliar1.IngredientesPlatillo) platilloAuxiliar1.IngredientesPlatillo = []

            if(platilloAuxiliar1.IngredientesPlatillo && index < platilloAuxiliar1.IngredientesPlatillo.length){
                delete platilloAuxiliar1.IngredientesPlatillo[index]
                platilloAuxiliar1.IngredientesPlatillo.splice(index, 1)
            }
            console.log(platilloAuxiliar1.IngredientesPlatillo)
            
        setPlatillo({...platilloAuxiliar1})

        
    }

    const addIngrediente = async () =>{
        let platilloAuxiliar = platillo

        console.log(platilloAuxiliar.IngredientesPlatillo)
        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.IngredientesPlatillo) platilloAuxiliar.IngredientesPlatillo = [];

        // Validate last filled
        let requiredKeys: any[] = [
            { key: 'nombre', name: 'un nombre', type: 'string' },
        ];
        let resultValidate = await validateDinamicArray('IngredientesPlatillo', requiredKeys, 'un ingrediente');
        if (!resultValidate) return;

        platilloAuxiliar.IngredientesPlatillo?.push({ nombre: '', costo: 0 })
        
        setPlatillo({...platilloAuxiliar})

    }


    const renderIngredientes = (item:any, index:number) =>{
        return(<>
            <Grid item xs={12} sm={6}>
                
                <TextField
                    defaultValue={item.nombre}
                    onChange={(text:any) => updateIngrediente(index, 'nombre', text.target.value)}
                    error={false}
                    inputRef = {(ref:any) => {textInputControl = ref}}
                    placeholder=''
                    
                />
                
            </Grid>
            <Grid item xs={12} sm={6} justifyContent="center" alignItems="center">
                <Button variant='contained' color='error' onClick={()=> deleteIngrediente(index, item)}>
                    Eliminar
                </Button>
            </Grid>
        </>)
    }

    async function addIngredienteExtra(){
        let platilloAuxiliar = platillo
        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.IngredientesExtraPlatillo) platilloAuxiliar.IngredientesExtraPlatillo = [];

        // Validate last filled
        let requiredKeys: any[] = [
            { key: 'nombre', name: 'un nombre', type: 'string' },
            { key: 'costo', name: 'un costo', type: 'number' },
        ];
        let resultValidate = await validateDinamicArray('IngredientesExtraPlatillo', requiredKeys, 'un ingrediente mas');
        if (!resultValidate) return;

        platilloAuxiliar.IngredientesExtraPlatillo?.push({ nombre: '', costo: 0 })
        setPlatillo({...platilloAuxiliar})
    }

    async function updateIngredienteExtra(index: number, key: string, value: any) {
        let platilloAuxiliar = platillo;

        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.IngredientesExtraPlatillo) platilloAuxiliar.IngredientesExtraPlatillo = [];

        // Update specific ingrediente by index
        if (platilloAuxiliar.IngredientesExtraPlatillo && index < platilloAuxiliar.IngredientesExtraPlatillo.length) {
            platilloAuxiliar.IngredientesExtraPlatillo[index][key] = value;
        }

        setPlatillo({...platilloAuxiliar})
    }

    async function deleteIngredienteExtra(index:any, element:any){

        //console.warn("IngredienteExtraId ",element.id)
        let platilloAuxiliar: any = platillo;

        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.IngredientesExtraPlatillo) platilloAuxiliar.IngredientesExtraPlatillo = [];

        // Update specific ingrediente by index
        if (platilloAuxiliar.IngredientesExtraPlatillo && index < platilloAuxiliar.IngredientesExtraPlatillo.length) {
            delete platilloAuxiliar.IngredientesExtraPlatillo[index]
            platilloAuxiliar.IngredientesExtraPlatillo.splice(index, 1)
        }

        setPlatillo({...platilloAuxiliar})
    }

    const renderIngredientesExtra = (item:any, index:number)=>{
        return(<>
            <Grid item xs={2} sm={4} md={4}>
                
                <TextField
                    defaultValue={item.nombre}
                    onChange={(text:any) => updateIngredienteExtra(index, 'nombre', text.target.value)}
                    error={false}
                    inputRef = {(ref:any) => {textInputControl = ref}}
                    placeholder=''
                />
            </Grid>

            <Grid item xs={2} sm={4} md={4}>
                    <TextField
                        defaultValue={item.costo}
                        onChange={(text:any) => updateIngredienteExtra(index, 'costo', text.target.value)}
                        error={false}
                        placeholder=''
                    />

            </Grid>

            <Grid item xs={2} sm={4} md={4}>
                    <Button variant='contained' color='error' onClick={()=> deleteIngredienteExtra(index, item)}>
                        Eliminar
                    </Button>

            </Grid>

            

            

        </>)
    }

    function deleteAlergia(index:any, element:any){
        //console.warn("IngredienteExtraId ",element.id)
        let platilloAuxiliar = platillo;

        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.AlergiasPlatillo) platilloAuxiliar.AlergiasPlatillo = [];

        // Update specific ingrediente by index
        if (platilloAuxiliar.AlergiasPlatillo && index < platilloAuxiliar.AlergiasPlatillo.length) {
            delete platilloAuxiliar.AlergiasPlatillo[index]
            platilloAuxiliar.AlergiasPlatillo.splice(index, 1)
        }

        setPlatillo({...platilloAuxiliar})
      
    }

    function updateAlergia(index: number, key: string, value: any){
        let platilloAuxiliar:any = platillo

        console.log("update",platilloAuxiliar.AlergiasPlatillo)
        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.AlergiasPlatillo) platilloAuxiliar.AlergiasPlatillo = [];

        // Update specific ingrediente by index
        if (platilloAuxiliar.AlergiasPlatillo && index < platilloAuxiliar.AlergiasPlatillo.length) {
            platilloAuxiliar.AlergiasPlatillo[index][key] = value;
            //            id = platillo.IngredientesExtraPlatillo[index].id
        }

        setPlatillo({...platilloAuxiliar})        
    }

    async function addAlergia(){
        let platilloAuxiliar = platillo

        console.log(platilloAuxiliar.AlergiasPlatillo)
        // Create array
        if (platilloAuxiliar && !platilloAuxiliar.AlergiasPlatillo) platilloAuxiliar.AlergiasPlatillo = [];

        // Validate last filled
        let requiredKeys: any[] = [
            { key: 'nombre', name: 'un nombre', type: 'string' },
        ];
        let resultValidate = await validateDinamicArray('AlergiasPlatillo', requiredKeys, 'una alergia mas');
        if (!resultValidate) return;

        platilloAuxiliar.AlergiasPlatillo?.push({ nombre: '', costo: 0 })
        
        setPlatillo({...platilloAuxiliar})

    }

    const renderAlergia = (item:any, index:number) =>{
        return(<>
            <Grid item xs={12} sm={6}>
                <TextField
                    defaultValue={item.nombre}
                    onChange={(text:any) => updateAlergia(index, 'nombre', text.target.value)}
                    error={false}
                    inputRef = {(ref:any) => {textInputControl = ref}}
                    placeholder=''
                />
            </Grid>
            <Grid item xs={12} sm={6} justifyContent="center" alignItems="center">
                <Button variant='contained' color='error' onClick={()=> deleteAlergia(index, item)}>
                    Eliminar
                </Button>
            </Grid>
        </>)
    }

    const uploadFile = async (file: any) =>{
        const reader = new FileReader()

        const {files} = file.target as HTMLInputElement

        let platilloAuxiliar = platillo

        if(files && files.length > 0){

            
            let file = files[0]
            
            let  resultUpload = await userService.uploadFile(file)

            let image
            if(!resultUpload.error && resultUpload.result){

                console.log("tipo",file.type)

                let fileToSave = {
                    uri: resultUpload.result,
                    name: file.name,
                    type: file.type
                }

                console.log(platilloImages)

                setFile((e:any)=>{
                    return fileToSave.uri})

                image = {uri: fileToSave.uri}
                let imagesAuxiliar = platilloImages
                imagesAuxiliar.push(image)
                imagesAuxiliar = [...imagesAuxiliar]
                

                setPlatilloImages(imagesAuxiliar)

                platilloAuxiliar.imagenes = JSON.stringify(imagesAuxiliar)
                setPlatillo({...platilloAuxiliar})
            }
        }

    }

    const uploadFiles = async (multipleFiles:any)=>{
        const {files} = multipleFiles.target as HTMLInputElement
        //console.log(files)
    
        if(files && files.length > 0){

            let resultUpload 
            let uriPath
            

            for(let imagen of files){
                let imagesPlatilloAuxiliar = platilloImages

                resultUpload = await userService.uploadFile(imagen)

                if(!resultUpload.error && resultUpload.result){
                    let fileToSave = {
                        uri: resultUpload.result,
                        name: imagen.name,
                        type: imagen.type
                    }
                    uriPath = {"uri": fileToSave.uri}
                    //console.log("a")
                    imagesPlatilloAuxiliar.push(uriPath)

                    setPlatilloImages({...imagesPlatilloAuxiliar})
                }
            }

            console.log(platilloImages)

            

        }
    }

    const updatePlatillo = async () =>{
        let values = getValues()


        let platilloAuxiliar = platillo

        values.imagenPrincipal = file

        

        setPlatillo({...platilloAuxiliar})

        
        let result = await service.updatePlatillos(idPlatillo, platillo, values)

        if(result && !result.error){
            router.back()
        }else{
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

    return(<> 
        <CardContent>
            <form noValidate autoComplete='off'>
                {
                    auth.isAdmin() ?
                    <Grid container spacing={7}>
                        {/* Nombre platillo */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='nombre'
                                    control={control}
                                    rules={{required: true}}
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
                            </FormControl>
                        </Grid>

                        {/**costo fijo */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='costoFijo'
                                    control={control}
                                    rules={{required: true}}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Costo de platillo'
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

                        {/* Descripcion */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='descripcion'
                                    control={control}
                                    rules={{required: true}}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Costo de platillo'
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

                        {/* Fotos de comida */}
                        <Grid item xs={12} sm={6}>
                            <Accordion>
                                <AccordionSummary>
                                    Imagenes del platillo
                                </AccordionSummary>
                                <AccordionDetails>
                                    {/* TODO: Convertir en componente */}
                                    <ImageList cols={3}>
                                        {
                                            platilloImages && (platilloImages.length > 0) &&
                                            platilloImages.map((item, index) => renderImageList(item, index))
                                        }

                                    </ImageList>

                                    <IconButton  htmlFor='upload-imgs' component='label' 
                                        
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


                                    </IconButton>   
                                </AccordionDetails>
                            </Accordion>
                        </Grid>


                        {/* Ingredientes */}
                        <Grid item xs={12} sm={6}>
                            <Accordion>
                                <AccordionSummary>
                                    Ingredientes de platillo.
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={7}>
                                        {
                                            platillo && platillo.IngredientesPlatillo
                                            && platillo.IngredientesPlatillo.map((item:any, index:any) => renderIngredientes(item, index))
                                        }

                                        <Grid item xs={12}>
                                            <Button variant='contained' onClick={addIngrediente}>
                                                Agregar ingrediente
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {/* Ingredientes extra */ }
                        <Grid item xs={12} sm={6}>
                            <Accordion>
                                <AccordionSummary>
                                    Ingredientes Extra
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={7}>
                                        {
                                            platillo && platillo.IngredientesExtraPlatillo &&
                                            platillo.IngredientesExtraPlatillo.map((item:any, index:any) => renderIngredientesExtra(item, index))
                                        }
                                        <Grid item xs={12}>
                                            <Button variant='contained' onClick={()=>addIngredienteExtra()}>
                                                Agregar ingrediente extra
                                            </Button>
                                        </Grid>                                        
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>

                        {/* Alergia */ }
                        <Grid item xs={12} sm={6}>
                            <Accordion>
                                <AccordionSummary>
                                    Alergias
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={7}>
                                        {
                                            platillo && platillo.AlergiasPlatillo &&
                                            platillo.AlergiasPlatillo.map((item:any, index:any) => renderAlergia(item, index))
                                        }
                                        <Grid item xs={12}>
                                            <Button variant='contained' onClick={() => addAlergia()}>
                                                Agregar Alergia
                                            </Button>
                                        </Grid>                                        
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>



                        <Grid item xs={12}>
                            <Button variant='contained' onClick={() => updatePlatillo()} sx={{ marginRight: 3.5 }}>
                                        Guardar Cambios
                            </Button>
                        </Grid>

                    </Grid> 
                    : null
                }
            </form>
        </CardContent>
    </>)

}

export default TabPlatilloEdit