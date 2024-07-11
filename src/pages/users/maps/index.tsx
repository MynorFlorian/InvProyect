// ** React Imports
import { useState, useEffect, useCallback, ReactElement } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { DataGrid } from '@mui/x-data-grid'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'

// ** Icons Imports
import PencilOutline from 'mdi-material-ui/PencilOutline'

// ** Store Imports

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import { RolData } from 'src/interfaces/objects/RolData'
import RolesService from 'src/services/RoleServices'
import UserService from 'src/services/UserService'
import { UserData } from 'src/interfaces/objects/UserData'
import { useRouter } from 'next/router'
import { Button, TextField } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import dynamic from "next/dynamic";
import { PedidoService } from 'src/services/PedidoService'

interface UserRoleType {
    [key: string]: ReactElement
}
    
interface UserStatusType {
    [key: string]: ThemeColor
}
    
  // ** Vars
    
interface CellType {
    row: UserData,
}

const Map = dynamic(() => import("../../components/Map"), {
    //loading: () => {console.log("Loading...")},
    ssr: false
  });


const UbicacionRepartidores = () =>{
    const service = new UserService()


    const [locations, setLocations] = useState<any[]>([]);

    useEffect(()=>{

        //getData()

    },[])


    const getData = () =>{
        service.getDeliveryLocation().then((e)=>{
            if(!e.error){
                console.log(e.result)
                setLocations(()=>{
                    return e.result
                })
            }else{
                alert("Error al obtener ubicación de repartidores. Hablar con IT.")    
            }
        })
    }


    return(<>
        <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Ubicacion de repartidores"/>
                        <CardContent></CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                        <Card>
                            <CardHeader title='Mapa' />
                            <CardContent>
                                <Map />
                            </CardContent>
                        </Card>
                </Grid>
        </Grid>
    </>)
}


export default UbicacionRepartidores

