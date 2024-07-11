// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
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
import Card from '@mui/material/Card'

// ** Icons Imports
import PencilOutline from 'mdi-material-ui/PencilOutline'
import Close from 'mdi-material-ui/Close'
import RolesService from 'src/services/RoleServices'
import PlatilloService from 'src/services/PlatilloService'
import { RolData } from 'src/interfaces/objects/RolData'
import { CategoriaData } from 'src/interfaces/objects/CategoriaData'

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
const servicePlatillo = new PlatilloService();
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
    nombre: '',
    costo: 0,
    cantidad: 1,
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

    UsuarioAsignadoId?: number;
    PlanId?: number;
    RolId?: number;
}

interface TabProps {
    UsuarioId?: number,
    PlatilloId?: number,
    callback?: any,
    dataIngredientes?: any,
    tipo: string,
    platilloId?: any,
    buttonText?: string,
}

const TabIngredientes = (props: TabProps) => {

    // Globals

    // ** State
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')
    const [messageSeverity, setMessageSeverity] = useState<string>('')
    const [ingredientes, setIngredientes] = useState<any[]>([])
    const [countRegisters, setCountRegisters] = useState<number>(0)
    const [uploading, setUploading] = useState<boolean>(false)

    //const [UsuarioId, setUsuarioId] = useState<number|undefined>(props.UsuarioId)

    // List's

    const {
        control,
        setError,
        handleSubmit,
        formState: { errors },
        getValues,
        reset,
        setValue
    } = useForm({
        defaultValues,
        mode: 'onBlur',
    })

    // Loading data
    useEffect(() => {
        /*if(UsuarioId) {
            getUser();
        }*/
        /*if(PlatilloId) {
            getPlatillo();
        }*/
        if(props.dataIngredientes){
            console.log(props.dataIngredientes)
            setIngredientes(props.dataIngredientes);
            setCountRegisters(props.dataIngredientes.length);
        }
    }, [])

    useEffect(() =>{

        if(openAlert){
            setTimeout(() => {
                setOpenAlert(false)
            }, 10000);
        }

    }, [openAlert])

    // Get Record
    /*const getUser = async () => {
        if(UsuarioId){
            let result = await service.getAccount(UsuarioId);
            if(result && !result.error && result.result){
                // Catch al data of model
                for(let key in result.result){
                    if(result.result[key]) {
                        //@ts-ignore
                        setValue(key, result.result[key]);
                    }
                }

            } else {
                let error = `Error al obtener datos: ${result.mensaje}`;
                await setMessageAlert(error);
                setOpenAlert(true);
                console.log(error);
            }
        }
    }*/

    //Add ingredient
    const addIngredient = async () => {

        let { nombre, cantidad, costo } = getValues();

        if(props.tipo != 'extras'){
            costo = 0;
        }

        if(!nombre) {
            await setMessageAlert('Rellene todos los campos');
            setOpenAlert(true);
            return;
        }

        let newIngredientes = [...ingredientes, {nombre, cantidad, costo}];

        setUploading(true);

        updateIngredients(newIngredientes, 'add');
        
        //setIngredientes([...ingredientes, { nombre, costo, id: -(ingredientes.length + 1) }]);
        //setCountRegisters(ingredientes.length);

        reset();

    }

    const updateIngredients = async (newIngredientes: any, type: string) => {
        let result = await servicePlatillo.updateIngAlergias(newIngredientes, props.platilloId, props.tipo);
        let message = type == 'add' ? 'Ingrediente agregado exitosamente' : 'Ingrediente eliminado exitosamente';
        if(result && !result.error && result.result){
            setIngredientes(result.result.data);
            setCountRegisters(result.result.data.length);
            await setMessageAlert(message);
            setMessageSeverity('success');
            setOpenAlert(true);

            if(type == 'add'){
                setUploading(false);
            }

        } else {
            let error = `Error al agregar ingrediente: ${result.mensaje}`;
            await setMessageAlert(error);
            setMessageSeverity('error');
            setOpenAlert(true);
        }
    }

    // Create Record
    const returnPlatilloData = async (type: string) => {
        props.callback({
            ingredientes: ingredientes,
            tipo: type 
        });
    }

    //List
    const defaultColumns = [
        // Nombre
        {
            flex: 0.25,
            minWidth: 230,
            field: 'nombre',
            headerName: 'Nombre',
            renderCell: ({ row }: any) => {
            const { nombre } = row
    
            return (
                    <Typography
                        noWrap
                        component='a'
                        variant='body2'
                        sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}
                    >
                        {nombre}
                    </Typography>
                )
            }
        },
    
        // Precio
        {
            flex: 0.25,
            field: 'precio',
            minWidth: 250,
            headerName: 'Precio',
            hide: props.tipo == 'extras' ? false : true,
            renderCell: ({ row }: any) => {
                return (
                    <Typography noWrap variant='body2' >
                    {row.costo}
                    </Typography>
                )
            }
        },
        {
            flex: 0.25,
            field: 'cantidad',
            minWidth: 250,
            headerName: 'Cantidad',
            renderCell: ({ row }: any) => {
                console.log(row)
                return (
                    <Typography noWrap variant='body2' >
                    {row.cantidad}
                    </Typography>
                )
            }
        },

        // Actions
        {
            flex: 0.15,
            minWidth: 75,
            sortable: false,
            field: 'actions',
            headerName: 'Acciones',
            renderCell: ({ row }: any) => {
                return row.id ? <RowOptions id={row.id}/> : <></>
            },
        }
    ]

    const RowOptions = ({ id }: { id: number | string }) => {
    
        // Remove from ingredientes
        const deleteIngredient = () => {
            let newIngredientes = ingredientes.filter((item) => item.id !== id);

            updateIngredients(newIngredientes, 'delete');

            //setIngredientes(newIngredientes);
            //setCountRegisters(newIngredientes.length);
        }   
    
        return (
            <>
                <IconButton size='small' onClick={deleteIngredient}>
                    <Close fontSize='small' sx={{ mr: 2 }} />
                </IconButton>
            </>
        )
    }

    return (
        <CardContent>
            <form noValidate autoComplete='off'>
                {/* Admin's and supervisor's */}
                {
                    <Grid container spacing={7}>

                        {/* Ingredientes */}

                        {/* Nombre */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                    <Controller
                                        name='nombre'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange, onBlur } }) => (
                                            <TextField
                                                label='Nombre Ingrediente'
                                                value={value}
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                error={false}
                                                placeholder=''
                                                onKeyPress={(e) => {

                                                    if (e.key === 'Enter') {
                                                        addIngredient();
                                                    }
                                                }}
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

                        {/* Cantidad */}
                        {
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Controller
                                            name='cantidad'
                                            control={control}
                                            rules={{ required: props.tipo == 'extras' ? true : false }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <TextField
                                                    label='Cantidad'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    error={false}
                                                    placeholder=''
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addIngredient();
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                        {   errors.costo && (
                                            <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                                {'Ingrese un costo valido e intente de nuevo.'}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                            </Grid>
                        }

                        {/* Costo */}
                        {
                            props.tipo == 'extras' ?
                            <Grid item xs={12} sm={2}>
                                <FormControl fullWidth sx={{ mb: 4 }}>
                                        <Controller
                                            name='costo'
                                            control={control}
                                            rules={{ required: props.tipo == 'extras' ? true : false }}
                                            render={({ field: { value, onChange, onBlur } }) => (
                                                <TextField
                                                    label='Costo'
                                                    value={value}
                                                    onBlur={onBlur}
                                                    onChange={onChange}
                                                    error={false}
                                                    placeholder=''
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            addIngredient();
                                                        }
                                                    }}
                                                />
                                            )}
                                        />
                                        {   errors.costo && (
                                            <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                                {'Ingrese un costo valido e intente de nuevo.'}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                            </Grid> : null
                        }

                        {/* Agregar */}
                        <Grid item xs={12} sm={2}>

                            <Button
                                variant='contained'
                                color='primary'
                                onClick={addIngredient}
                                sx={{ mt: 2 }}
                            >
                                {
                                    uploading ? (
                                        <img src="/images/loader-white.svg" alt="loader" style={{
                                            height: '25px',
                                            width: '25px',
                                        }} />
                                    ) : (
                                        'Agregar'
                                    )
                                }
                            </Button>

                        </Grid>

                        {/* Alert */}
                        {openAlert ? (
                            <Grid item xs={12} sx={{ mb: 3 }}>
                                <Alert
                                    severity={ messageSeverity == 'success' ? 'success' : 'error' }
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
                            <Card>
                                <DataGrid
                                    autoHeight
                                    rows={ingredientes}
                                    disableSelectionOnClick
                                    columns={defaultColumns}
                                    rowCount={countRegisters}
                                />
                            </Card>
                        </Grid>

                        <Grid item xs={12}>
                            <Button variant='contained' onClick={() => returnPlatilloData('anterior')} sx={{ marginRight: 3.5 }}>
                                Anterior
                            </Button>
                            <Button variant='contained' onClick={() => returnPlatilloData(props.buttonText ?? 'siguiente')} sx={{ marginRight: 3.5 }}>
                                {props.buttonText ?? 'Siguiente'}
                            </Button>
                        </Grid>
                    </Grid>
                }

            </form>
        </CardContent>
    )
}

export default TabIngredientes
