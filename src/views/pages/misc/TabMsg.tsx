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
const serviceRoles = new RolesService();
const serviceLogin = new LoginService();
const service = new UserService();

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import UserService from 'src/services/UserService'
import LoginService from 'src/services/LoginService'
import { FormHelperText } from '@mui/material'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'
import { RolUsuarioData } from 'src/interfaces/objects/RolUsuarioData'

// Default values to display
const defaultValues = {
    title: '',
    body: '',
}

const TabMsg = () => {

    // Globals
    const router = useRouter()
    const auth = useAuth();

    // ** State
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')

    const {
        control,
        formState: { errors },
        getValues,
    } = useForm({
        defaultValues,
        mode: 'onBlur',
    })

    // Create Record
    const sendMessage = async () => {
        let values: any = getValues();
        let result = await service.sendMassMessage(values);
        if(result && !result.error && result.result){
            router.back();
        } else {
            let error = `Error al enviar mensaje: ${result.mensaje}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }
    }

    return (
        <CardContent>
            <form noValidate autoComplete='off'>
                {/* Admin's and supervisor's */}
                {
                    auth.isAdmin() ?
                    <Grid container spacing={7}>

                        {/* Título */}
                        <Grid item xs={12} sm={12} lg={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='title'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Título'
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

                        {/* Contenido */}
                        <Grid item xs={12} sm={12} lg={12}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='body'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Contenido'
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
                            </FormControl>
                        </Grid>

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
                            <Button variant='contained' onClick={() => sendMessage()} sx={{ marginRight: 3.5 }}>
                                Enviar
                            </Button>
                        </Grid>
                    </Grid>
                    : null
                }

            </form>
        </CardContent>
    )
}

export default TabMsg
