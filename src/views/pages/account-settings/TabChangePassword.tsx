// ** React Imports
import { ChangeEvent, MouseEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserService from 'src/services/UserService'

import toast from 'react-hot-toast'
import ModalPassword from 'src/pages/components/modalPassword'
import { route } from 'next/dist/server/router'
import { useRouter } from 'next/router'

const service = new UserService();

interface State {
    newPassword: string
    showNewPassword: boolean
    confirmNewPassword: string
    showConfirmNewPassword: boolean
}

interface Props {
    UsuarioId: number
}

const TabChangePassword = ({ UsuarioId } : Props) => {
    // ** States
    const [values, setValues] = useState<State>({
        newPassword: '',
        showNewPassword: false,
        confirmNewPassword: '',
        showConfirmNewPassword: false
    })

    const router = useRouter();
    const { id } = router.query;

    const [showModalCambio, setShowModalCambio] = useState<boolean>(false)
    const [showModalTemp, setShowModalTemp] = useState<boolean>(false)

    // Handle New Password
    const handleNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value })
    }
    const handleClickShowNewPassword = () => {
        setValues({ ...values, showNewPassword: !values.showNewPassword })
    }
    const handleMouseDownNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    // Handle Confirm New Password
    const handleConfirmNewPasswordChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value })
    }
    const handleClickShowConfirmNewPassword = () => {
        setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
    }
    const handleMouseDownConfirmNewPassword = (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
    }

    // Create Record
    const updatePassword = async () => {
        if(values.newPassword && values.confirmNewPassword && values.newPassword == values.confirmNewPassword){
            let result = await service.updatePassword(UsuarioId, values.newPassword);
            if(result && !result.error && result.result){
                setValues({ ...values, newPassword: '', confirmNewPassword: '' })
                toast.success('Contraseña actualizada con éxito!');

            } else {
                let error = `Error al obtener datos: ${result.mensaje}`;
                toast.error('Ha ocurrido un error al actualizar la contraseña.')
                console.log(error);
            }
        }
        setShowModalCambio(false)
    }

    const sendTemporalPassword = async () => {
        let result = await service.sendTemporalPassword(UsuarioId)

        if(result && !result.error && result.result){
            toast.success("Contraseña temporal enviada con exito!")
        }else{
            toast.error("Ha ocurrido un error al enviar contraseña. "+result.message)
        }

        setShowModalTemp(false)
    }

    return (
        <>
            <form>
                <CardContent sx={{ paddingBottom: 0 }}>
                    <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={5}>

                        <Grid item xs={12} sx={{ marginTop: 6 }}>
                            <FormControl fullWidth>
                            <InputLabel htmlFor='account-settings-new-password'>Contraseña nueva</InputLabel>
                            <OutlinedInput
                                label='Contraseña nueva'
                                value={values.newPassword}
                                id='account-settings-new-password'
                                onChange={handleNewPasswordChange('newPassword')}
                                type={values.showNewPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                    edge='end'
                                    onClick={handleClickShowNewPassword}
                                    aria-label='toggle password visibility'
                                    onMouseDown={handleMouseDownNewPassword}
                                    >
                                    {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                            <InputLabel htmlFor='account-settings-confirm-new-password'>Confirmar nueva contraseña</InputLabel>
                            <OutlinedInput
                                label='Confirmar nueva contraseña'
                                value={values.confirmNewPassword}
                                id='account-settings-confirm-new-password'
                                type={values.showConfirmNewPassword ? 'text' : 'password'}
                                onChange={handleConfirmNewPasswordChange('confirmNewPassword')}
                                endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                    edge='end'
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowConfirmNewPassword}
                                    onMouseDown={handleMouseDownConfirmNewPassword}
                                    >
                                    {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                                    </IconButton>
                                </InputAdornment>
                                }
                            />
                            </FormControl>
                        </Grid>
                        </Grid>
                    </Grid>
                    </Grid>

                </CardContent>

                <CardContent>
                    <Grid container spacing={5}>
                        <Grid item xs={12} sx={{marginTop: 10}}>
                                <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={() => { /*updatePassword()*/setShowModalCambio(true) }}>
                                    Cambiar contraseña
                                </Button>
                                <Button variant='outlined' sx={{ marginRight: 3.5 }} onClick={() => { /*sendTemporalPassword()*/setShowModalTemp(true) }}>
                                    Enviar contraseña autogenerada
                                </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </form>
            {
                showModalCambio ? 
                    <ModalPassword
                        callBack={updatePassword}
                        handleClose={() => setShowModalCambio(false)}
                        message='Confirma usted el cambio de contraseña?'
                        password=''
                        showModal={showModalCambio}
                    />
                : null
            }
            {
                showModalTemp ? 
                    <ModalPassword
                    callBack={sendTemporalPassword}
                    handleClose={() => setShowModalTemp(false)}
                    message='Quieres enviar una contraseña temporal auto-generada?'
                    password=''
                    showModal={showModalTemp}
                    /> 
                : null
            }
        </>
    )
}
export default TabChangePassword
