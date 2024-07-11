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

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import VisualizacionService from 'src/services/VisualizacionService'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
}




type ComponentProps = {
    UsuarioId ?: number
}

const ContadoresInfluencer = (props:ComponentProps) => {

    const [visualizacionesInfluencer, setVisualizacionesInfluencer] = useState<any[]>([])
    const service = new VisualizacionService()
    
    const getData = async() =>{

        let result = await service.getContadores(props.UsuarioId ?? 0)

        if(result && !result.error && result.result){
            console.log('resultadocontadores',result.result)

            setVisualizacionesInfluencer(() => {
                return [
                    {
                        stats: result.result.visualizaciones,
                        title: 'Visualizaciones',
                        color: 'primary',
                        icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />
                    },
                    {
                        stats: result.result.referidos,
                        title: 'Referidos',
                        color: 'success',
                        icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
                    },
                ]
            })

        } else {
            // error
            console.log('Error',result)
        }
        
    }

    useEffect(() =>{
        getData()
    },[])

    const renderStats = () => {
        return visualizacionesInfluencer.map((item: DataType, index: number) => (
            <Grid item xs={12} style={{marginRight: 70}} sm={4} key={index}>
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar variant='rounded' color={item.color} sx={{ mr: 3, boxShadow: 3, width: 44, height: 44 }}>
                {item.icon}
                </CustomAvatar>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='caption'>{item.title}</Typography>
                <Typography variant='h6'>{item.stats}</Typography>
                </Box>
            </Box>
            </Grid>
        ))
    }
    

    return (
        <Card>
            <CardHeader
                title='Estadisticas de influencer'
                action={
                <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
                    <DotsVertical />
                </IconButton>
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
                {renderStats()}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ContadoresInfluencer
