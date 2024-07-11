// ** React Imports
import { ReactElement, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import UserService from 'src/services/UserService'
import { AnyAaaaRecord } from 'dns'

interface DataType {
    stats: string
    title: string
    color: ThemeColor
    icon: ReactElement
}

interface CocinerosCount {
    title: string,
    conteo: number
}

const ConteoStatus = () =>{ 

    const service = new UserService()

    // ** Hook
    const theme = useTheme()

    const [conteoCocineros, setConteoCocineros] = useState<any>()
    const [listaConteos, setListaConteos] = useState<any>()

    const getData = async () =>{
        let data = await service.getCocinerosStatus()
        let conteo = conteoCocineros

        if(data && !data.error && data.result){
            setConteoCocineros(data.result)
            setListaConteos(Object.keys(data.result))
        }else{
            alert("Error al obtener conteo de cocineros. "+data.mensaje)
        }
    }


    useEffect(() =>{
        getData()

        console.log(conteoCocineros)
    },[])

    const renderStats = (item:any, index:any) => {
        console.log("Item", item, conteoCocineros[item])
        return(    
            <Grid item xs={12} sm={4} key={index}>
                <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CustomAvatar variant='rounded' color={'primary'} sx={{ mr: 3, boxShadow: 3, width: 44, height: 44 }}>
                        <AccountOutline sx={{ fontSize: '1.75rem' }} />
                    </CustomAvatar>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='caption'>{item.charAt(0).toUpperCase() + item.slice(1)}</Typography>
                        <Typography variant='h6'>{conteoCocineros[item]}</Typography>
                    </Box>
                </Box>
            </Grid>)

    }

    return(<>
    <Card> 
        <CardHeader
            title='Conteo de cocineros por status'
            action={
                <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
                    <DotsVertical />
                </IconButton>
            }
            subheader={
                <Typography variant='body2'>
                    <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                    </Box>
                </Typography>
            }
            titleTypographyProps={{
                sx: {
                    mb: 2.25,
                    lineHeight: '2rem !important',
                    letterSpacing: '0.15px !important'
                }
            }}
        />
        <CardContent sx={{ pt: theme => `${theme.spacing(0.75)} !important` }}>
            <Grid container spacing={[5, 0]}>
                {listaConteos && 
                    listaConteos.map((item:any, index:any) => renderStats(item, index))}
            </Grid>
        </CardContent>
    </Card>
    </>) 
}


export default ConteoStatus 