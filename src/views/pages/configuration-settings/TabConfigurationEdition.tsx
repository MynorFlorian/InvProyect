// ** React Imports
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import { Alert, CardHeader } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import Close from 'mdi-material-ui/Close'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import ReactChipInput from "react-chip-input";



import { ConfiguracionData } from '../../../interfaces/objects/ConfiguracionData';
import ConfiguracionService from '../../../services/ConfiguracionService';


import { LocaleStorage } from 'src/utils/localeStorage';



interface State {
    newPassword: string
    showNewPassword: boolean
    confirmNewPassword: string
    showConfirmNewPassword: boolean
}

interface Props {
    ConfiguracionId: number;
}

const TabConfigurationEdition = ({ ConfiguracionId }: Props) => {

    const service = new ConfiguracionService()
    const localStorage = new LocaleStorage();

    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')
    const [configuration, setConfiguration] = useState<ConfiguracionData>()
    const [chips, setChips] = useState<any[]>([])
    const [admin, setAdmin] = useState<number | undefined>(undefined)


    useEffect(() => {
        getConfigurationData();
        getAdmin();
    }, [])



    const getAdmin = async () => {
        let admin = await localStorage.getUser()
        if (admin) {
            setAdmin((e) => {
                return admin?.id
            })
        }
    }

    const addChip = (value: any) => {
        let Tmpchips = chips.slice();
        Tmpchips.push(value);
        setChips(Tmpchips);
    }

    const removeChip = (index: any) => {
        let Tmpchips = chips.slice();
        Tmpchips.splice(index, 1);
        setChips(Tmpchips);
    }

    const getConfigurationData = async () => {
        let resp = await service.getRecord(ConfiguracionId);
        if (!resp.error) {
            let resultData: ConfiguracionData = resp.result
            setConfiguration(resultData);
            if(resultData && resultData.configuracion){
                let jsonConfiguration = JSON.parse(resultData.configuracion)
                setChips(jsonConfiguration)
            }
        }
    }


    // update configuration
    const updateConfiguration = async () => {
        let dataConfiguration = {
            configuracion: chips,
            UsuarioId: admin
        }
        let resp = await service.updateRecord(ConfiguracionId, dataConfiguration);
        if(!resp.error){
            setMessageAlert(`Configuración actualizada!`);
            setOpenAlert(true);
        }else{
            setMessageAlert(`${resp.mensaje}`);
            setOpenAlert(true);
        }
    }

    return (
        <>
            <CardHeader title={configuration ? configuration.titulo : ''} />
            <CardContent sx={{ paddingBottom: 0 }}>
                <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                        <Grid container spacing={5}>
                            <Grid item xs={12} sx={{ marginTop: 1 }}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor='edition-configuration-new-password'>Configuración</InputLabel>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                            <FormControl fullWidth>
                                <ReactChipInput
                                    classes="class1 class2 chipinput chip-border-color box-shadow-color"
                                    chips={chips}
                                    onSubmit={(value:any) => addChip(value)}
                                    onRemove={(index:any) => removeChip(index)}
                                />
                            </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
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
            </CardContent>
            <CardContent>
                <Box sx={{ mt: 11 }}>
                    <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={() => { updateConfiguration() }}>
                        Guardar
                    </Button>
                </Box>
            </CardContent>
        </>
    )
}
export default TabConfigurationEdition
