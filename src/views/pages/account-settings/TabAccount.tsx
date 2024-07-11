// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select, { SelectChangeEvent } from '@mui/material/Select'
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

const SelectStyles = {
    PaperProps: {
        style: {
            maxHeight: 300, // Ajusta esta altura según tus necesidades
            maxWidth: 300  // Ajusta esta anchura según tus necesidades
        }
    }
}

// Services
const serviceRoles = new RolesService();
const serviceLogin = new LoginService();
const service = new UserService();
const territorioService = new TerritorioService();

// statics
const paises = Statics.instance.paises;

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
import ModalStatusRegistro from 'src/pages/components/modalStatusRegistro'
import ModalDeleteUsuario from 'src/pages/components/modalDeleteUsuario'
import { TerritorioData } from 'src/interfaces/objects/TerritorioData'
import { TerritorioService } from 'src/services/TerritorioService'

// Default values to display
const defaultValues = {
    nombre: '',
    telefono: '',
    correo: '',
    imagenUsuario: '',
    activada: true,
    eliminado: false,
    correoValido: false,
    telefonoValido: true,
    codigoAuxiliar: '',
    codigoReferido: '',
    consumidorStripe: '',
    categorias: '',

    //Referido code from referente
    codigoReferente: '',

    //Banc. and personal information

    fechaNacimiento: undefined,
    licenciaConduccion: '',
    status: '',
    banco: '',
    iban: '',
    codigoPostal: '',
    dni: '',
    password: '',

    //      Personal
    nombreP: '',
    apellido: '',
    descripcion:'',

    UsuarioAsignadoId: undefined,
    PlanId: undefined,
    RolId: undefined,

    //Territorios
    pais: 0,
    estado: 0,
    municipio: 0,
    colonia: 0,
    postal: '',

    codigo: '',
}

interface FormData {
    id?: number;
    nombre: string;
    telefono?: string;
    correo?: string,
    hash: string;
    imagenUsuario?: string,
    activada: boolean;
    eliminado: boolean;
    correoValido: boolean,
    telefonoValido: boolean,
    codigoAuxiliar?: string;
    codigoReferido?:string;
    consumidorStripe?:string;
    categorias?: string;
    password?: string;

    // Referido code from referente
    codigoReferente?:string;
    UsuarioReferenteId?: number; // ForeigKey

    // Banc. and personal information
    fechaNacimiento?: Date;
    licenciaConduccion?: string;
    status?: string;
    banco?: string;
    iban?: string;
    codigoPostal?: string;
    dni?: string;

    // Personal
    nombreP?: string;
    apellido?:string;
    descripcion?:string;

    UsuarioAsignadoId?: number;
    PlanId?: number;
    RolId?: number;
}

interface TabProps {
    UsuarioId?: number,
    rolTab?: string
}

const toUpperCamelCase = (str: string): string => {
    return str
        .split(/[\s_-]+/) // Dividir por espacio, guión o subrayado
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
};

const labelDefiner = (level: number, pais: number) => {
    // level --> tipos de territorios (0: estado, 1: municipio, 2: colonia)
    // pais --> id del pais (1: México, 2: Costa Rica)
    const label = Statics.instance.paises.find(p => p.id == pais)?.tipos[level] ?? "Label";
    return toUpperCamelCase(label);
};

const levelDefiner = (level: number, pais: number) => {
    const tipo = Statics.instance.paises.find(p => p.id == pais)?.tipos[level] ?? "tipo";
    return tipo;
}

const TabAccount = (props: TabProps) => {

    // Globals
    const router = useRouter()
    const auth = useAuth();

    // ** State
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')
    const [imgSrc, setImgSrc] = useState<string>('/images/avatars/1.png')

    const [UsuarioId, setUsuarioId] = useState<number|undefined>(props.UsuarioId)
    const [banderaInfluencer, setBanderaInfluencer] = useState<boolean>(false)

    // List's
    const [roles, setRoles] = useState<RolData[]|undefined>(undefined);
    const [file, setFile] = useState<any>('https://images.assetsdelivery.com/compings_v2/thesomeday123/thesomeday1231709/thesomeday123170900021.jpg')

    // Territorios
    const [estados, setEstados] = useState<TerritorioData[]>([]);
    const [municipios, setMunicipios] = useState<TerritorioData[]>([]);
    const [colonias, setColonias] = useState<TerritorioData[]>([]);

    const [pais, setPais] = useState(0);
    const [estado, setEstado] = useState<number>(0);
    const [municipio, setMunicipio] = useState<number>(0);
    const [colonia, setColonia] = useState<number>(0);
    const [codigoPostal, setCodigoPostal] = useState<string>('');

    // Modal
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [stateRegistro, setstateRegistro] = useState<string>('')

    // Modal confirmacion de eliminaicon
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false)
    const [nombreCompleto, setnombreCompleto] = useState('')

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
        getRoles();
        if(UsuarioId) {
            getUser();
        }
    }, [])

    useEffect(() => {
        console.log("File",file)
    },[file])


    const onChange = (file: ChangeEvent) => {
        const reader = new FileReader()
        const { files } = file.target as HTMLInputElement
        if (files && files.length !== 0) {
            reader.onload = () => setImgSrc(reader.result as string)

            reader.readAsDataURL(files[0])
        }
    }

    const fillTerritorios = async (territorios: TerritorioData[]) => {
        if(territorios.length == 0) return;
        const paises = Statics.instance.paises;
        const paisUser = territorios[0].pais;
        const paisFulled = paises.find(pais => pais.nombre == paisUser);
        if(!paisFulled) return;
        setPais(paisFulled?.id ?? 1);
        const estadoUser = territorios.find((territorio) => territorio.tipo === levelDefiner(0, paisFulled?.id ?? 1));
        const municipioUser = territorios.find((territorio) => territorio.tipo === levelDefiner(1, paisFulled?.id ?? 1));
        const coloniaUser = territorios.find((territorio) => territorio.tipo === levelDefiner(2, paisFulled?.id ?? 1));

        const estados = await territorioService.getEstadosByPais(paisFulled.nombre);
        setEstados(estados.result);

        if (estadoUser && estadoUser.id) {
            const municipios = await territorioService.getMunicipios(estadoUser.id, paisFulled.nombre);
            setMunicipios(municipios.result);
            setEstado(estadoUser.id);
        }

        if (municipioUser && municipioUser.id) {
            const colonias = await territorioService.getColonias(municipioUser.id, paisFulled.nombre);
            setColonias(colonias.result);
            setMunicipio(municipioUser.id);
        }

        if (coloniaUser && coloniaUser.id) {
            setColonia(coloniaUser.id);
            setCodigoPostal(coloniaUser.codigoPostal || '');
        }
    };

    // Get Record
    const getUser = async () => {
        if(UsuarioId){
            let result = await service.getAccount(UsuarioId);
            if(result && !result.error && result.result){
                // Catch al data of model
                for(let key in result.result){
                    if(result.result[key]) {
                        //@ts-ignore
                        setValue(key, result.result[key]);
                        console.log(key)
                    }
                }

                setnombreCompleto((e) =>{

                    return result.result["nombre"]
                })

                const coloniaUser = 0;
                const direccionUser = result.result["Direcciones"];
                if(coloniaUser || direccionUser){
                    if (direccionUser.length > 0 && direccionUser[0].TerritorioId) {

                    }
                }

                setstateRegistro((e)=>{
                    return result.result['statusRegistro']
                })

                setFile((e:any) =>{
                    if(result.result.imagenUsuario){
                        return result.result.imagenUsuario
                    }
                    return 'https://images.assetsdelivery.com/compings_v2/thesomeday123/thesomeday1231709/thesomeday123170900021.jpg'

                })

                await fillTerritorios(result.result.territorios);
                await validateRoles(result.result);
            } else {
                let error = `Error al obtener datos: ${result.mensaje}`;
                await setMessageAlert(error);
                setOpenAlert(true);
                console.log(error);
            }
        }
    }

    const validateRoles = async (data: any) => {
        // Validate the user is client
        if(data && data.RolesUsuario && Array.isArray(data.RolesUsuario)){
            let roles: RolUsuarioData[] = data.RolesUsuario;
        }
    }

    const uploadFile = async (file: any) =>{
        const reader = new FileReader()

        const {files} = file.target as HTMLInputElement

        if(files && files.length > 0){


            let file = files[0]

            let  resultUpload = await service.uploadFile(file)


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

    const handleChangePais = async(event: SelectChangeEvent<number>) => {
        let paisParsed = parseInt(event.target.value.toString());
        let paisFulled = paises.find(p => p.id == paisParsed);
        if(!paisFulled)  return;
        let res = await territorioService.getEstadosByPais(paisFulled.nombre);
        let estados = !res.error ? res.result : [];
        setPais(() => {
            setValue('estado', paisFulled?.id ?? 1);
            return paisFulled?.id ?? 1
        })
        setEstados(estados);
        setEstado(0);
    };

    const handleChangeEstado = async(event: SelectChangeEvent<number>) => {
        if(pais == 0) return;
        let paisFulled = paises.find(p => p.id == pais);
        if(!paisFulled)  return;
        let estadoParsed = parseInt(event.target.value.toString());
        let res = await territorioService.getMunicipios(estadoParsed, paisFulled.nombre);
        let municipios = !res.error ? res.result : [];
        setEstado(() => {
            setValue('estado', estadoParsed);
            return estadoParsed;
        });
        setMunicipios(municipios);
        setMunicipio(0);
    };

    const handleChangeMunicipio = async(event: SelectChangeEvent<number>) => {
        if(pais == 0) return;
        let paisFulled = paises.find(p => p.id == pais);
        if(!paisFulled)  return;
        let municipio = event.target.value;
        let municipioParsed = parseInt(municipio.toString());
        let res = await territorioService.getColonias(municipioParsed, paisFulled.nombre);
        let colonias = !res.error ? res.result : [];
        setMunicipio(() => {
            setValue('municipio', municipioParsed);
            return municipioParsed;
        });
        setColonias(colonias);
        setColonia(0);
        setCodigoPostal('');
    };

    const handleChangeColonia = (event: SelectChangeEvent<number>) => {
        let colonia = event.target.value;
        let coloniaParsed = parseInt(colonia.toString());
        setColonia(() => {
            setValue('colonia', coloniaParsed);
            return coloniaParsed;
        });
        let codigoPostal = colonias.find((colonia: TerritorioData) => colonia.id == coloniaParsed)?.codigoPostal ?? "";
        setCodigoPostal(()=> {
            setValue('codigoPostal', codigoPostal);
            return codigoPostal;
        });

    };

    // Create Record
    const createUser = async () => {
        let values:any = getValues();

        values.estado = estado
        values.municipio = municipio
        values.colonia = colonia
        values.postal = codigoPostal

        values.imagenUsuario = file

        let result = await service.create(values, props.rolTab);
        if(result && !result.error && result.result){
            router.push('/');
        } else {
            let error = `Error al obtener datos: ${result.mensaje}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }
    }

    // Create Record
    const updateUser = async () => {
        let values: any = getValues();

        values.estado = estado
        values.municipio = municipio
        values.colonia = colonia
        values.postal = codigoPostal

        let result = await service.updateAccount(values);
        if(result && !result.error && result.result){
            router.back();
        } else {
            let error = `Error al obtener datos: ${result.mensaje}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }
    }

    // Get List
    const getRoles = async () => {
        let result = await serviceRoles.get();
        if(result && !result.error && result.result){
            let roles: RolData[] = result.result;
            setRoles(roles);
        } else {
            let error = `Error al obtener datos: ${result.message}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }
    }

    // Modal change status cook
    const changeStatusRegister = () =>{
        setOpenModal((e)=>{
            return true
        })
    }

    // Modal change status cook
    const changeModalDeleteUsuario = () =>{
        setOpenModalDelete((e)=>{
            return true
        })
    }

    const alertChangeStatusRegister = (mensaje:any) =>{
        setMessageAlert(mensaje);
        setOpenAlert(true);
    }

    return (<>
        <CardContent>
            <form noValidate autoComplete='off'>
                {/* Admin's and supervisor's */}
                {
                    auth.isAdmin() || auth.isMarketing() ?
                    <Grid container spacing={7}>

                        {/* Nombres */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='nombre'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Nombre y apellido'
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

                        {/* DNI */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='dni'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='INE'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={false}
                                                placeholder=''
                                            />
                                        )}
                                    />
                                    {   errors.dni && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese una identificación válida e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                        </Grid>

                        {/* Teléfono */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='telefono'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Teléfono'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={false}
                                                placeholder=''
                                            />
                                        )}
                                    />
                                    {   errors.telefono && (
                                        <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                            {'Ingrese un numero telefónico valido e intente de nuevo.'}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                        </Grid>

                        {/* Contraseña */}
                        {
                            !UsuarioId ?
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Controller
                                            name='password'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <TextField
                                                    label='Contraseña'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    error={false}
                                                    placeholder=''
                                                />
                                            )}
                                        />
                                        {   errors.telefono && (
                                            <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                                {'Ingrese una contraseña valida e intente de nuevo.'}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                            </Grid> : null
                        }

                        {/* Correo electrónico */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='correo'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Correo electrónico'
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            error={false}
                                            placeholder=''
                                        />
                                    )}
                                />
                                {   errors.correo && (
                                    <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                        {'Ingrese un correo valido e intente de nuevo.'}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Descripcion del usuarios (por lo general sera para asignar a cocineros) */}
                        { props.rolTab == Statics.instance.COCINERO_USER &&
                            <Grid item xs={12} sm={12}>
                                <FormControl fullWidth>
                                    <Controller
                                        name='descripcion'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Descripcion del Cocinero'
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

                        {/* Imagen de perfil */}
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
                                            src={`${file}`}
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

                        {/* Territorios */}
                        {
                            (props.rolTab == Statics.instance.COCINERO_USER) && <>
                                {/* Provincia */}
                                <Grid item xs={12} sm={6}>

                                    <FormControl fullWidth sx={{ mb: 4, }}>
                                            <Controller
                                                name='pais'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field: { value, onChange, onBlur } }) => (
                                                    <>
                                                        <InputLabel id="demo-simple-select-label">País</InputLabel>
                                                        <Select
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            value={pais}
                                                            onChange={handleChangePais}
                                                            label="País"
                                                            MenuProps={SelectStyles}
                                                        >
                                                            <MenuItem value={0} selected>Seleccione</MenuItem>
                                                            {
                                                                paises.length > 0 && paises.map((pais) => (
                                                                    <MenuItem key={pais.id} value={pais.id}>{pais.label}</MenuItem>
                                                                ))
                                                            }
                                                        </Select>
                                                    </>
                                                )}
                                            />
                                            {errors.pais && (
                                            <FormHelperText sx={{ color: 'error.main' }}>{errors.pais.message}</FormHelperText>
                                            )}
                                    </FormControl>

                                    {
                                        pais > 0 && (
                                            <FormControl fullWidth sx={{ mb: 4, }}>
                                                <Controller
                                                    name='estado'
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field: { value, onChange, onBlur } }) => (
                                                        <>
                                                            <InputLabel id="demo-simple-select-label">{labelDefiner(0, pais)}</InputLabel>
                                                            <Select
                                                                labelId="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={estado}
                                                                onChange={handleChangeEstado}
                                                                label={labelDefiner(0, pais)}
                                                                MenuProps={SelectStyles}
                                                            >
                                                                <MenuItem value={0} selected>Seleccione</MenuItem>
                                                                {
                                                                    estados.length > 0 && estados.map((estado) => (
                                                                        <MenuItem key={estado.id} value={estado.id}>{estado.nombre}</MenuItem>
                                                                    ))
                                                                }
                                                            </Select>
                                                        </>
                                                    )}
                                                />
                                                {errors.estado && (
                                                <FormHelperText sx={{ color: 'error.main' }}>{errors.estado.message}</FormHelperText>
                                                )}
                                            </FormControl>
                                        )
                                    }

                                    {
                                        estado > 0 && (
                                            <FormControl fullWidth sx={{ mb: 4 }}>
                                                    <Controller
                                                        name='municipio'
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange, onBlur } }) => (
                                                            <>
                                                                <InputLabel id="demo-simple-select-label">{labelDefiner(1, pais)}</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={municipio}
                                                                    onChange={handleChangeMunicipio}
                                                                    label={labelDefiner(1, pais)}
                                                                    MenuProps={SelectStyles}
                                                                >
                                                                    <MenuItem value={0} selected>Seleccione</MenuItem>
                                                                    {
                                                                        municipios.length > 0 && municipios.map((municipio) => (
                                                                            <MenuItem key={municipio.id} value={municipio.id}>{municipio.nombre}</MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </>
                                                        )}
                                                    />
                                                    {errors.municipio && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.municipio.message}</FormHelperText>
                                                    )}
                                            </FormControl>
                                        )

                                    }

                                    {
                                        municipio > 0 && (
                                            <FormControl fullWidth sx={{ mb: 4 }}>
                                                    <Controller
                                                        name='colonia'
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field: { value, onChange, onBlur } }) => (
                                                            <>
                                                                <InputLabel id="demo-simple-select-label">{labelDefiner(2, pais)}</InputLabel>
                                                                <Select
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    value={colonia}
                                                                    onChange={handleChangeColonia}
                                                                    label={labelDefiner(2, pais)}
                                                                    MenuProps={SelectStyles}
                                                                >
                                                                    <MenuItem value={0} selected>Seleccione</MenuItem>
                                                                    {
                                                                        colonias.length > 0 && colonias.map((colonia) => (
                                                                            <MenuItem key={colonia.id} value={colonia.id}>{colonia.nombre}</MenuItem>
                                                                        ))
                                                                    }
                                                                </Select>
                                                            </>
                                                        )}
                                                    />
                                                    {errors.colonia && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.colonia.message}</FormHelperText>
                                                    )}
                                            </FormControl>
                                        )
                                    }

                                    {
                                        colonia > 0 && (
                                            <FormControl fullWidth sx={{ mb: 4 }}>
                                                <TextField
                                                    disabled
                                                    value={codigoPostal}
                                                    label='Código Postal'
                                                    placeholder='Código Postal'
                                                />
                                            </FormControl>
                                        )
                                    }

                                </Grid>
                            </>
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
                                !UsuarioId
                                ?
                                    <Button variant='contained' onClick={() => createUser()} sx={{ marginRight: 3.5 }}>
                                        Crear Usuario
                                    </Button>
                                :
                                    <Grid xs={12} container>
                                        <Grid item xs={8} sm={6}>
                                            {/* Button guardar cambios */}
                                            <Button variant='contained' onClick={() => updateUser()} sx={{ marginRight: 3.5 }}>
                                                Guardar Cambios
                                            </Button>
                                            {/* Button de cambiar estado, aplica solo para cocineros */}
                                            {
                                                (props.rolTab == Statics.instance.COCINERO_USER) &&
                                                <Button sx={{ mt: 1, mr: 1 }}  variant="outlined" onClick={() => changeStatusRegister()}>
                                                    Cambiar Estado
                                                </Button>
                                            }
                                        </Grid>
                                        <Grid xs={4} item>
                                            <Button variant="outlined" color="error" onClick={() => changeModalDeleteUsuario()} startIcon={<DeleteForever />}>
                                                Eliminar Usuario
                                            </Button>
                                        </Grid>
                                    </Grid>
                            }
                        </Grid>
                    </Grid>
                    : null
                }

            </form>
        </CardContent>
        {
            openModal && <ModalStatusRegistro
                show={openModal}
                handleClose={() =>  setOpenModal(false)}
                statusRegistro = {stateRegistro}
                userId = {UsuarioId}
                handleNextState = { (statePos:string) => setstateRegistro(statePos)}
                handleAlert = { (mensaje:string)=> alertChangeStatusRegister(mensaje)}
            />
        }
        {
            openModalDelete && <ModalDeleteUsuario
                show={openModalDelete}
                nombre= {nombreCompleto}
                userId = {UsuarioId}
                handleClose={() =>  setOpenModalDelete(false)}
                handleAlert = { (mensaje:string)=> alertChangeStatusRegister(mensaje)}
            />
        }
    </>)
}

export default TabAccount
