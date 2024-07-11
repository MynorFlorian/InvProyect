// ** React Imports
import { ReactNode, useState, Fragment, MouseEvent, ChangeEvent, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'

import toast from 'react-hot-toast'

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
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { Grid } from '@mui/material'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// ** Third Party Imports
import Payment from 'payment'
import Cards, { Focused } from 'react-credit-cards'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'
import { useRouter } from 'next/router'
import UserService from 'src/services/UserService'
import { MetodoPagoData } from 'src/interfaces/objects/MetodoPagoData'

const defaultValues = {
    email: '',
    username: '',
    password: '',
    terms: false
}
interface FormData {
    email: string
    terms: boolean
    username: string
    password: string
}

// ** Styled Components
const RegisterIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
    padding: theme.spacing(20),
    paddingRight: '0 !important',
    [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(10)
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
    left: '1.875rem',
    position: 'absolute',
    [theme.breakpoints.down('lg')]: {
        left: 0
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
    textDecoration: 'none',
    color: theme.palette.primary.main
}))

const Img = styled('img')(({ theme }) => ({
    alignSelf: 'center'
}))

const RegisterCard = () => {
    // ** States
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [name, setName] = useState<string>('')
    const [alias, setAlias] = useState<string>('')
    const [show, setShow] = useState<boolean>(false)
    const [cvc, setCvc] = useState<string | number>('')
    const [cardNumber, setCardNumber] = useState<string>('')
    const [focus, setFocus] = useState<Focused | undefined>()
    const [expiry, setExpiry] = useState<string | number>('')

    // ** Hook
    const theme = useTheme()
    const router = useRouter()

    // ** Vars
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    const service = new UserService();

    // ** Hooks
    const {
        settings: { skin }
    } = useSettings()
    const { register } = useAuth()
    const {
        control,
        setError,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onBlur',
    })

    // ** First Charge Hook
    useEffect(() => {
        validateUser();
    }, [])

    const validateUser = () => {
        let { id } = router.query;
    }

    const onSubmit = () => {
        let { id } = router.query;
        let idParsed = id && !isNaN(+id) ? +id : undefined;
        let expirySplited = `${expiry}`.split('/');
        let mesExpiracion = expirySplited && expirySplited.length > 0 ? +expirySplited[0] : 0;
        let anioExpiracion = expirySplited && expirySplited.length > 1 ? +expirySplited[1] : 0;

        let sendData: any = {
            titular: name,
            number: cardNumber.replaceAll(' ', ''),
            mesExpiracion: mesExpiracion,
            anioExpiracion: anioExpiracion,
            ultimosDigitos: '',
            alias,
            cvc: `${cvc}`,

            UsuarioId: idParsed,
        };

        // service.create(sendData).then((result) => {
        //     if(result && !result.error){
        //         toast('Se a guardado tu método de pago con éxito!', { duration: 2000 })
        //     } else {
        //         toast('Ha ocurrido un error al guardar tu método de pago!', { duration: 2000 })
        //     }
        // });

        handleClose();
    }

    const handleBlur = () => setFocus(undefined)

    const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (target.name === 'number') {
            target.value = formatCreditCardNumber(target.value, Payment)
            setCardNumber(target.value)
        } else if (target.name === 'expiry') {
            target.value = formatExpirationDate(target.value)
            setExpiry(target.value)
        } else if (target.name === 'cvc') {
            target.value = formatCVC(target.value, cardNumber, Payment)
            setCvc(target.value)
        }
    }

    const handleClose = () => {
        setShow(false)
        setCvc('')
        setName('')
        setExpiry('')
        setCardNumber('')
        setAlias('')
        setFocus(undefined)
    }

    return (
        <Box className='content-right'>
        {!hidden ? (
            <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
            <RegisterIllustrationWrapper>
                <RegisterIllustration
                alt='register-illustration'
                src={`/images/pages/auth-v2-register-illustration-${
                    theme.palette.mode === 'light' ? 'light' : 'dark'
                }.png`}
                />
            </RegisterIllustrationWrapper>
            <FooterIllustrationsV2 image={<TreeIllustration alt='tree' src='/images/pages/tree-2.png' />} />
            </Box>
        ) : null}
        <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
            <Box
            sx={{
                p: 12,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.paper'
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
                <svg
                    width={35}
                    height={29}
                    version='1.1'
                    viewBox='0 0 30 23'
                    xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                >
                    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                    <g id='Artboard' transform='translate(-95.000000, -51.000000)'>
                        <g id='logo' transform='translate(95.000000, 50.000000)'>
                        <path
                            id='Combined-Shape'
                            fill={theme.palette.primary.main}
                            d='M30,21.3918362 C30,21.7535219 29.9019196,22.1084381 29.7162004,22.4188007 C29.1490236,23.366632 27.9208668,23.6752135 26.9730355,23.1080366 L26.9730355,23.1080366 L23.714971,21.1584295 C23.1114106,20.7972624 22.7419355,20.1455972 22.7419355,19.4422291 L22.7419355,19.4422291 L22.741,12.7425689 L15,17.1774194 L7.258,12.7425689 L7.25806452,19.4422291 C7.25806452,20.1455972 6.88858935,20.7972624 6.28502902,21.1584295 L3.0269645,23.1080366 C2.07913318,23.6752135 0.850976404,23.366632 0.283799571,22.4188007 C0.0980803893,22.1084381 2.0190442e-15,21.7535219 0,21.3918362 L0,3.58469444 L0.00548573643,3.43543209 L0.00548573643,3.43543209 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 L15,9.19354839 L26.9548759,1.86636639 C27.2693965,1.67359571 27.6311047,1.5715689 28,1.5715689 C29.1045695,1.5715689 30,2.4669994 30,3.5715689 L30,3.5715689 Z'
                        />
                        <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='0 8.58870968 7.25806452 12.7505183 7.25806452 16.8305646'
                        />
                        <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='0 8.58870968 7.25806452 12.6445567 7.25806452 15.1370162'
                        />
                        <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='22.7419355 8.58870968 30 12.7417372 30 16.9537453'
                            transform='translate(26.370968, 12.771227) scale(-1, 1) translate(-26.370968, -12.771227) '
                        />
                        <polygon
                            id='Rectangle'
                            opacity='0.077704'
                            fill={theme.palette.common.black}
                            points='22.7419355 8.58870968 30 12.6409734 30 15.2601969'
                            transform='translate(26.370968, 11.924453) scale(-1, 1) translate(-26.370968, -11.924453) '
                        />
                        <path
                            id='Rectangle'
                            fillOpacity='0.15'
                            fill={theme.palette.common.white}
                            d='M3.04512412,1.86636639 L15,9.19354839 L15,9.19354839 L15,17.1774194 L0,8.58649679 L0,3.5715689 C3.0881846e-16,2.4669994 0.8954305,1.5715689 2,1.5715689 C2.36889529,1.5715689 2.73060353,1.67359571 3.04512412,1.86636639 Z'
                        />
                        <path
                            id='Rectangle'
                            fillOpacity='0.35'
                            fill={theme.palette.common.white}
                            transform='translate(22.500000, 8.588710) scale(-1, 1) translate(-22.500000, -8.588710) '
                            d='M18.0451241,1.86636639 L30,9.19354839 L30,9.19354839 L30,17.1774194 L15,8.58649679 L15,3.5715689 C15,2.4669994 15.8954305,1.5715689 17,1.5715689 C17.3688953,1.5715689 17.7306035,1.67359571 18.0451241,1.86636639 Z'
                        />
                        </g>
                    </g>
                    </g>
                </svg>
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
                </Box>
                <Box sx={{ mb: 6 }}>
                    <TypographyStyled variant='h5'>Ingresa tu tarjeta</TypographyStyled>
                    {/* <Typography variant='body2'>Tu tarjeta esta segura y protegida por QPayPro!</Typography> */}
                    <Img width={'50%'} alt='QPayPro' src='/images/logos/QPayPro_Logo.png' />
                </Box>
                <form noValidate autoComplete='off'>

                <Grid container spacing={6}>
                    {/* Card animation */}
                    <Grid item xs={12}>
                        <CardWrapper sx={{ '& .rccs': { margin: '0 auto', display: { xs: 'flex', sm: 'block' } } }}>
                            <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} placeholders={{ name: 'Tu nombre aquí' }}/>
                        </CardWrapper>
                    </Grid>

                    {/* Form */}
                    <Grid item xs={12} style={{ marginTop: 20 }}>
                        <Grid container spacing={6}>

                            {/* Alias */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name='alias'
                                    value={alias}
                                    autoComplete='off'
                                    onBlur={handleBlur}
                                    label='Apodo de mi tarjeta'
                                    placeholder='Nombre de mi tarjeta'
                                    onChange={e => setAlias(e.target.value)}
                                    onFocus={e => setFocus(e.target.name as Focused)}
                                />
                            </Grid>

                            {/* Numero de la tarjeta */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name='number'
                                    value={cardNumber}
                                    autoComplete='off'
                                    label='Numero de mi tarjeta'
                                    onBlur={handleBlur}
                                    onChange={handleInputChange}
                                    placeholder='0000 0000 0000 0000'
                                    onFocus={e => setFocus(e.target.name as Focused)}
                                />
                            </Grid>

                            {/* Nombre */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name='name'
                                    value={name}
                                    autoComplete='off'
                                    onBlur={handleBlur}
                                    label='Nombre'
                                    placeholder='Nombre de mi tarjeta'
                                    onChange={e => setName(e.target.value)}
                                    onFocus={e => setFocus(e.target.name as Focused)}
                                />
                            </Grid>

                            {/* Fecha y año de expiración */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name='expiry'
                                    label='Expiración'
                                    value={expiry}
                                    onBlur={handleBlur}
                                    placeholder='MM/YY'
                                    onChange={handleInputChange}
                                    inputProps={{ maxLength: '5' }}
                                    onFocus={e => setFocus(e.target.name as Focused)}
                                />
                            </Grid>

                            {/* Código de seguridad */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name='cvc'
                                    label='CVC'
                                    value={cvc}
                                    autoComplete='off'
                                    onBlur={handleBlur}
                                    onChange={handleInputChange}
                                    onFocus={e => setFocus(e.target.name as Focused)}
                                    placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7, marginTop: 10 }}
                    onClick={onSubmit}>
                    Guardar
                </Button>

                </form>
            </BoxWrapper>
            </Box>
        </RightWrapper>
        </Box>
    )
}

RegisterCard.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

RegisterCard.guestGuard = true


export default RegisterCard
