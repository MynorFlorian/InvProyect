// ** React Imports
import { useState, ReactNode, MouseEvent } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import useBgColor from 'src/@core/hooks/useBgColor'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { globalColors } from 'src/utils/styles'

//Animation
import Lottie from 'react-lottie'
import { BoxCutter } from 'mdi-material-ui'
// import * as animationData from "../../../public/assets/delivey.json";

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    /*padding: theme.spacing(20),
    paddingRight: '0 !important',
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10)
    }*/
}))

const BoxLogin = styled(Box)<BoxProps>(({ theme }) => ({
    backgroundImage: `url(/images/Inventario/background.jpg)`,
    backgroundColor: '#EEF5F7',
    backgroundPosition: 'bottom center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
}))

const LoginIllustration = styled('img')(({ theme }) => ({
    maxWidth: '48rem',
    [theme.breakpoints.down('lg')]: {
        maxWidth: '35rem'
    }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        maxWidth: 450
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

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontWeight: 600,
    marginBottom: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const LinkStyled = styled('a')(({ theme }) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
    '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
        color: theme.palette.text.secondary
    }
}))

// Default values to display
const defaultValues = {
    password: '',
    email: ''
}

interface FormData {
    email: string | number
    password: string
}

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    // ** Hooks
    const auth = useAuth()
    const theme = useTheme()
    const bgClasses = useBgColor()
    const { settings } = useSettings()
    const hidden = useMediaQuery(theme.breakpoints.down('md'))

    // ** Vars
    const { skin } = settings

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onBlur',
    })

    const onSubmit = (data: FormData) => {
        const { email, password } = data
        auth.login({ email, password }, () => {
            setError('password', {
                type: 'manual',
                message: 'Tus credenciales son incorrectas'
            })
        })
    }

    //Lottie
    // const defaultOptions = {
    //     loop: true,
    //     autoplay: true,
    //     animationData: animationData,
    //     rendererSettings: {
    //     preserveAspectRatio: 'xMidYMid slice'
    //     }
    // };

    return (
        <Box className='content-right'>
            {/* Ilustacion */}
            {!hidden ? (
            <BoxLogin sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                <LoginIllustrationWrapper>
                    <LoginIllustration
                        alt='login-illustration'
                        src='/images/Inventario/inventario.jpg'
                    />
                </LoginIllustrationWrapper>
            </BoxLogin>
            ) : null}
            <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
                {/* Container */}
                <Box
                    sx={{
                        p: 12,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: globalColors.blanco
                    }}
                >
                    <BoxWrapper>
                        <Box
                            sx={{
                                top: 30,
                                left: 40,
                                display: 'flex',
                                position: 'absolute',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography
                                variant='h6'
                                sx={{
                                ml: 3,
                                lineHeight: 1,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                fontSize: '1.5rem !important'
                                }}
                            >
                                {themeConfig.templateName}
                            </Typography>
                            <svg width="35" height="35"
                                xmlns="http://www.w3.org/2000/svg">
                                <BoxCutter />
                            </svg>
                        </Box>

                        {/* Welcome message */}
                        <Box sx={{ mb: 6 }}>
                            <TypographyStyled variant='h5'>Bienvenido a {themeConfig.templateName}!</TypographyStyled>
                            <Typography variant='body2'>Por favor ingresa tus credenciales para iniciar sesión.</Typography>
                        </Box>

                        {/* Initial credentials */}
                        {/* <Box sx={{ mb: 6 }}>
                        <Box sx={{ py: 3, px: 4, borderRadius: 1, ...bgClasses.primaryLight }}>
                            <Typography variant='caption' sx={{ mb: 2, display: 'block', color: 'primary.main' }}>
                            Admin: <strong>admin@materio.com</strong> / Pass: <strong>admin</strong>
                            </Typography>
                            <Typography variant='caption' sx={{ display: 'block', color: 'primary.main' }}>
                            Client: <strong>client@materio.com</strong> / Pass: <strong>client</strong>
                            </Typography>
                        </Box>
                        </Box> */}

                        {/* Form */}
                        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>

                            {/* Email */}
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='email'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            autoFocus
                                            label='Teléfono o Email'
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            error={false}
                                            placeholder=''
                                        />
                                    )}
                                />
                                {   errors.email && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        Por favor ingrese un teléfono o correo electrónico valido.
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {/* Contraseña */}
                            <FormControl fullWidth>
                                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                                    Contraseña
                                </InputLabel>
                                <Controller
                                    name='password'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <OutlinedInput
                                            value={value}
                                            onBlur={onBlur}
                                            label='Contraseña'
                                            onChange={onChange}
                                            id='auth-login-v2-password'
                                            error={Boolean(errors.password)}
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment  position='end'>
                                                    <IconButton
                                                        edge='end'
                                                        onMouseDown={e => e.preventDefault()}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOutline /> : <EyeOffOutline/>}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    )}
                                />
                                {   errors.password && (
                                    <FormHelperText sx={{ color: 'error.main' }} id=''>
                                        {errors.password.message}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {/* Recover Password */}
                            {/* <Box
                                sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 5 }}
                            >
                                <FormControlLabel control={<Checkbox />} label='Remember Me' />
                                <Link passHref href='/forgot-password'>
                                <LinkStyled>Olvidaste tu contraseña?</LinkStyled>
                                </Link>
                            </Box> */}

                            {/* Login */}
                            <Button fullWidth size='large' type='submit' variant='contained' sx={{ marginBottom: 7, marginTop: 7 }}>
                                Iniciar sesión
                            </Button>

                            {/* Register */}
                            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>                                
                                <Typography variant='body2'>
                                <br style={{
                                    marginBottom: 20
                                }} />
                                <Link passHref href='/register-delivery'>
                                    <LinkStyled>Recuperar Contraseña</LinkStyled>
                                </Link>
                                </Typography>
                            </Box>
                        </form>
                    </BoxWrapper>
                </Box>
            </RightWrapper>
        </Box>
    )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
