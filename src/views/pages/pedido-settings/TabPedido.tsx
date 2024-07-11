import { Alert, AlertTitle, CardContent, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import Button, { ButtonProps } from '@mui/material/Button'
import { Close } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from 'src/hooks/useAuth';
import { PedidoData } from 'src/interfaces/objects/PedidoData';
import { PedidoService } from 'src/services/PedidoService';
import { Statics } from 'src/utils/statics';
import { globalColors } from 'src/utils/styles';

const TabPedido = (props: { id: number }) => {

    const service = new PedidoService();
    const auth = useAuth();
    const router = useRouter()

    const defaultValues = {
        id: 0,
        status: '',
        DetallesPedido: []
    }

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
    });

    const [statusPedido] = useState(Statics.instance.statusPedido);

    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [messageAlert, setMessageAlert] = useState<string>('')

    const getPedido = async() => {
        let result = await service.getDetail(props.id);

        if(result && !result.error && result.result){
            let record: any = result.result;
            reset({
                id: record.id,
                status: record.status,
                DetallesPedido: record.DetallesPedido ?? []
            })
        } else {
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log(error);
        }
    };

    const guardarCambios = async() => {
        let values:any = getValues();
        let detallePedido = values.DetallesPedido[0];
        let usuarioId = detallePedido.UsuarioCocineroId ?? 0;
        let result = await service.setPedidoStatus(
            values.id,
            values.status,
            values.id,
            false,
            usuarioId,
        );
        console.warn(result);
        if(result && !result.error && result.result){
            router.back();
        } else {
            let error = `Error al obtener datos: ${result.mensaje}`;
            await setMessageAlert(error);
            setOpenAlert(true);
            console.log(error);
        }
    };

    useEffect(() => {
        if (props.id) {
            getPedido();
        }
    }, [props]);

    const notStatusPedido = 'Ningún Estado'
    return (
        <CardContent>
            <form action=''>
                {auth.isAdmin() && (
                    <Grid container spacing={7}>
                        {/* Número de ID */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='id'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <TextField
                                            label='Número de pedido'
                                            value={value}
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            error={false}
                                            placeholder='Número de pedido'
                                            disabled
                                        />
                                    )}
                                />
                                {errors.id && (
                                    <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                        {'Ingrese un Número de pedido valido e intente de nuevo.'}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth sx={{ mb: 4 }}>
                                <Controller
                                    name='status'
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => {
                                        // console.log(value);
                                        return(
                                            <>
                                                <InputLabel>Estado del Pedido</InputLabel>
                                                <Select
                                                    label='Estado del Pedido'
                                                    defaultValue={notStatusPedido}
                                                    onChange={onChange}
                                                    inputProps={{ placeholder: 'Seleccione un Estado' }}
                                                    value={value}
                                                >
                                                    <MenuItem key={`status-1`} value={notStatusPedido}>
                                                        {notStatusPedido}
                                                    </MenuItem>
                                                    {statusPedido.map((item: any, index: number) => {
                                                        return (
                                                            <MenuItem key={`status${index}`} value={item.id}>
                                                                {item.descripcion}
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </>
                                        )
                                    }}
                                />
                                {errors.id && (
                                    <FormHelperText sx={{ color: globalColors.greenInventario }}>
                                        {'Ingrese un Estado de pedido valido e intente de nuevo.'}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        {/* Alert */}
                        {openAlert && (
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
                        )}
                        <Grid item xs={12}>
                            <Button variant='contained' onClick={guardarCambios} sx={{ marginRight: 3.5 }}>
                                Guardar Cambios
                            </Button>
                        </Grid>
                    </Grid>
                )}
            </form>
        </CardContent>
    )
}

export default TabPedido
