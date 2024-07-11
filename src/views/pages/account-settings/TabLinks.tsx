// ** React Imports
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import { PlatilloData } from 'src/interfaces/objects/PlatilloData'
import { styled } from '@mui/material/styles'
import {TextField} from  '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
// ** Next Import
import Link from 'next/link'
import { useRouter } from 'next/router'
// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
//import PedidoService from 'src/services/PedidoService'
import { PedidoService } from 'src/services/PedidoService'
import PlatilloService from 'src/services/PlatilloService'
import PencilOutline from 'mdi-material-ui/PencilOutline'
import toast from 'react-hot-toast'

import { getInitials } from 'src/@core/utils/get-initials'
import { PedidoData } from 'src/interfaces/objects/PedidoData'
import VisualizacionService from 'src/services/VisualizacionService'
import { Statics } from 'src/utils/statics'
import ModalPassword from 'src/pages/components/modalPassword'
import ContadoresInfluencer from 'src/views/components/contadores/ContadoresInfluencer'

type ComponentProps ={
    UsuarioId : number
}

const TabLinks = ({UsuarioId}:ComponentProps) => {

    const service = new VisualizacionService()
    const [visualiaciones, setVisualizaciones] = useState<number>(0)
    const [referidos, setReferidos] = useState<number>(0)
    const [showLastLink, setShowLastLink] = useState<boolean>(false)
    const [newLink, setNewLink] = useState<any>(new Object())


    const getLink = async () => {

        setShowLastLink(true)

        let result = await service.createLink(UsuarioId)

        if(result && !result.error && result.result){
            let res = result.result
            setNewLink(() =>{
                return new Object({
                    cocinero: Statics.instance.portalBase + 'register/?influencer=' + res.result,
                    delivery: Statics.instance.portalBase + 'register-delivery/?influencer=' + res.result
                })
            })
            console.log(newLink)
        }else{
            console.log("Linkc")
            console.log(result.message)
        }
    }

    return(
        <>
            <CardContent>
                <Grid container spacing={7}>
                    <Grid item xs={12} sm={6}>
                        <ContadoresInfluencer 
                            UsuarioId={UsuarioId}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>

                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Button variant='contained' onClick={() => {getLink()}} sx={{ marginRight: 3.5 }}>
                            Generar nuevo link
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
            {
                showLastLink
                ? 
                    <ModalPassword
                        callBack={()=>{}}
                        showModal={showLastLink}
                        handleClose={()=>setShowLastLink(false)}
                        password=''
                        message={''}
                        banderaLinks={true}
                        links={newLink}
                    />
                : 
                null
            }
        </>
    )
}

export default TabLinks