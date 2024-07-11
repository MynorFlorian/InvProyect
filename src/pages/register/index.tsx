// ** React Imports
import { ReactNode, useState, Fragment, MouseEvent, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Button, { ButtonProps } from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import ChevronDown from 'mdi-material-ui/ChevronDown'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Date Imports
import { DatePicker, LocalizationProvider } from '@mui/lab'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'

//Lottie
import Lottie from 'react-lottie'
import * as animationData from 'src/utils/assets/success.json'

//Services
import UserService from 'src/services/UserService'
// import { TerritorioService } from 'src/services/TerritorioService'
// import ModalPassword from '../components/modalPassword'
import { BoxCutter, TriangleOutline, Trumpet } from 'mdi-material-ui'
import { Statics } from 'src/utils/statics'
// import VisualizacionService from 'src/services/VisualizacionService'
import Head from 'next/head'
// import { TerritorioData } from 'src/interfaces/objects/TerritorioData'
import toast from 'react-hot-toast'

const defaultValues = {
    nombre: '',
    telefono: '',
    correo: undefined,
    fechaNacimiento: undefined,
    dni: '',
    password: '',
    terms: false,
    provincia: 0,
    canton: 0,
    distrito: 0,
    postal: '',
    codigo: '',
    pais: 0,
    estado: 0,
    municipio: 0,
    colonia: 0,
    codigoPostal: '',
}
interface FormData {
    nombre: string;
    telefono: string;
    correo: string | undefined,
    fechaNacimiento: Date | undefined;
    dni: string;
    password: string,
    terms?: boolean,
    codigo?: string,
    pais?: number,
    estado?: number,
    municipio?: number,
    colonia?: number,
    codigoPostal?: string,
    type?: string,
    UsuarioReferenteId ?: number
}

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    padding: theme.spacing(20),
    paddingRight: '0 !important',
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10)
    },
    [theme.breakpoints.down('sm')]: {
        display: 'none'
    }
}))

const RegisterIllustration = styled('img')(({ theme }) => ({
  maxWidth: '46rem',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '35rem'
  }
}))

const TreeIllustration = styled('img')(({ theme }) => ({
  bottom: 0,
  left: 0,
  position: 'absolute',
  zIndex: -1,
  [theme.breakpoints.down('lg')]: {
    left: '-3rem',
    bottom: '-3rem',
    width: '100%',
    height: '100%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '80%',
    height: '80%',
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.down('xl')]: {
    width: '100%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const BoxLogoMobile = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
    },
    [theme.breakpoints.up('sm')]: {
        display: 'none',
    },
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const GeneralBox = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
    width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
    width: '72%',
    //Semi transparent top border
    borderTop: '1px solid rgba(0, 0, 0, 0.1)',
    }
}))

const HeaderBox = styled(Box)<BoxProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
    width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
    width: '100%',
    }
}))

const ReviewsContainer = styled(Box)<BoxProps>(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    /*'&:before': {
        content: '" "',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundImage: 'url(https://www.pasadenahealthcenter.com/es/wp-content/uploads/2019/10/shutterstock_553662235.jpg)',
        filter: 'blur(8px)',
        webkitFilter: 'blur(8px)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: '0.3',
        transition: 'background 0.3s, border-radius 0.3s, opacity 0.3s'
    }*/

}))

const ButtonAbout = styled(Button)<ButtonProps>(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        left: '50%',
        transform: 'translateX(-50%)',
    },
    [theme.breakpoints.down('md')]: {
        left: '50%',
        transform: 'translateX(-50%)',
    },
    [theme.breakpoints.down('sm')]: {
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'auto',
        whiteSpace: 'nowrap',
    }
}))

const ButtonRegister = styled(Button)<ButtonProps>(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}))

const FooterLogo = styled('img')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        width: '10%',
    },
    [theme.breakpoints.down('sm')]: {
        width: '40%',
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
};

//Services
const service = new UserService();
// const territorioService = new TerritorioService();
const paises = Statics.instance.paises;

const Register = () => {
    // ** States
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [actualStep, setActualStep] = useState<number>(0)
    const [btnsiguiente, setBtnsiguiente] = useState<boolean>(false)
    const [displayRegistro, setDisplayRegistro] = useState<string>('block')
    const [user, setUser] = useState<UserData>()
    const [codigoVerificacion, setCodigoVerificacion] = useState<string>('')
    const [codigo, setCodigo] = useState<string>('')
    const [intentosCodigo, setIntentosCodigo] = useState<number>(0)
    const [timer, setTimer] = useState<number>(0)
    const [reenvio, setReenvio] = useState<boolean>(false)
    const timeOutCallback = useCallback(() => setTimer(currTimer => currTimer - 1), [])
    const [showModalContrasenia, setShowModalContrasenia] = useState<boolean>(false)
    const [password, setPassword] = useState<string>("")
    const [influencerId, setInfluencerId] = useState<number>(0)

    // Territorios
    // const [estados, setEstados] = useState<TerritorioData[]>([]);
    // const [municipios, setMunicipios] = useState<TerritorioData[]>([]);
    // const [colonias, setColonias] = useState<TerritorioData[]>([]);

    const [pais, setPais] = useState(0);
    const [estado, setEstado] = useState<number>(0);
    const [municipio, setMunicipio] = useState<number>(0);
    const [colonia, setColonia] = useState<number>(0);
    const [codigoPostal, setCodigoPostal] = useState<string>('');

    const router = useRouter()
    console.log('router', router.pathname)

    // const visualizacionService = new VisualizacionService()

    // ** Hook
    const theme = useTheme()

    // ** Vars
    //const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const hidden = false;

    // ** Hooks
    const {
        settings: { skin }
    } = useSettings()
    const { register } = useAuth()
    const {
        control,
        setError,
        clearErrors,
        handleSubmit,
        getValues,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onBlur',
    });

    //Esconder el scroll
    useEffect(() => {
        //document.body.style.overflow = 'hidden'
        createVisualizacion()
    }, [])

    const createVisualizacion = async() => {
        let {influencer} = router.query

        if(influencer){
            let hash:any = influencer
            console.log('Cultura',hash)
            let res = {error: true}

            if(res && !res.error){
                // setInfluencerId(res.result)
                //console.log("RESPUEST", res.result, res.message)
            }else{
                //console.log("ERROR", res.message)
            }
        }
    }


    //Ref scroll info
    const ref = useRef<HTMLDivElement>(null)

    //Ref scroll register
    const registerRef = useRef<HTMLDivElement>(null)

    
    return (
        <>

            <Head>
                <title>Registro {router.pathname == '/register' ? 'Cocineros' : 'Repartidores'}</title>
            </Head>
            {/* Container del registro */}
            {/* <Box className='content-right' ref={registerRef} style={{
                minHeight: '80vh',
                //semi transparent border bottom with margin
                borderBottom: '1px solid rgba(0,0,0,0.1)',
            }}>

            </Box> */}

            {/* Container información Inventario */}

            <GeneralBox sx={{
                marginTop: '3rem',
            }} ref={ref}>
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Typography variant='h4'>
                            ¿Qué es Inventario?
                        </Typography>
                    </Box>
                    <Box>
                        <p>
                            <Typography variant='body1'>
                                Información 
                                (Decidir si se agrega la informacion o no.)
                            </Typography>
                        </p>
                    </Box>
                </Container>
            </GeneralBox>


        </>
    )
}

Register.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Register.guestGuard = true

export default Register
