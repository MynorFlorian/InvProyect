// ** React Imports
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import ModalGeneral from 'src/pages/components/modal'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'
import Modal from '@mui/material'
import { useRouter } from 'next/router'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import RolesService from 'src/services/RoleServices'
import { RolData } from 'src/interfaces/objects/RolData'

import { getInitials } from 'src/@core/utils/get-initials'
import { DireccionesService } from 'src/services/DireccionesService'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { useAuth } from 'src/hooks/useAuth'
import UserService from 'src/services/UserService'
import LoginService from 'src/services/LoginService'
import { Card, CardHeader, FormHelperText } from '@mui/material'
import { globalColors } from 'src/utils/styles'
import { UserData } from 'src/interfaces/objects/UserData'
import { RolUsuarioData } from 'src/interfaces/objects/RolUsuarioData'
import { DireccionData } from 'src/interfaces/objects/DireccionData'
import { RotateRight } from 'mdi-material-ui'

const service = new DireccionesService()

interface Props {
    DireccionId:number
}


const TabGenerales = (props:Props) =>{

    const [validacion, setValidacion] = useState<boolean>(false)
    const [openModalEliminar, setOpenModalEliminar] = useState<boolean>(false)
    const [openModalValidar, setOpenModalValidar] = useState<boolean>(false)


    const router = useRouter()

    useEffect(() =>{
        getStatusValidacion()
    }, [])


    const getStatusValidacion = async () =>{
        let res = await service.getDireccion(props.DireccionId)

        if(res && !res.error){
            setValidacion((e)=>{
                return res.result.confirmacion
            })
        }else{
            alert("Error al obtener status de validación. "+res.mensaje)
        }
    }

    const updateValidacion = async ()=>{
        
        let res = await service.changeConfirmationStatus(props.DireccionId)

        if(res && !res.error){
            router.back()
        }else{
            alert("Error al actualizar status de validación. "+res.mensaje)
        }

    }

    const eliminarDireccion = async () =>{
        let res = await service.deleteDireccion(props.DireccionId)

        if(res && !res.error){
            router.back()
        }else{
            alert("Error al eliminar dirección. "+res.mensaje)
        }    
    }

    const openEliminar = ()=>{
        setOpenModalEliminar((e)=>{
            return true
        })
    }

    const openValidar = () =>{
        setOpenModalValidar((e)=>{const router = useRouter()
            return true
        })
    }



    return(<>
        <CardContent sx={{ paddingBottom: 0 }}>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title={`Estado de establecimiento: ${validacion?"Dirección Verificada.":"Pendiente de verificación."}`}/>
                        <CardContent>
                            <Grid item sm={4} xs={12}>
                                {!validacion ? 
                                <Button variant='contained' type='submit' onClick={openValidar}>
                                    Validar 
                                </Button> : null }
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Eliminar dirección de los registros."/>
                        
                        <CardContent>
                                <Grid item sm={4} xs={12}>
                                    
                                    <Button variant='contained' type='submit' onClick={openEliminar}>
                                            Eliminar
                                    </Button> 
                                
                                </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </CardContent>
        { 
            
            openModalEliminar && <ModalGeneral
                showEliminar={openModalEliminar}
                showValidar={openModalValidar}
                handleAction={eliminarDireccion}
                handleClose={() =>  setOpenModalEliminar(false)}
            />
        }
        {
            openModalValidar && <ModalGeneral
                showEliminar={openModalEliminar}
                showValidar={openModalValidar}
                handleAction={updateValidacion}
                handleClose={() => setOpenModalValidar(false)}
            />
        }
    </>)

}

export default TabGenerales