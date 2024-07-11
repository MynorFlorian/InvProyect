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
import { Button, CircularProgress, TextField } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import dynamic from "next/dynamic";
import { PedidoService } from 'src/services/PedidoService'
import GoogleMapReact from 'google-map-react'

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

const RegistrosPorZona = () =>{
    const service = new UserService()

    const [provincias, setProvincias] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [gettingData, setGettingData] = useState<boolean>(false);
    const mapCenter = {lat: 9.917816115029414, lng: -84.0910364822702}

    useEffect(()=>{
        getDistritos()
    },[])

    useEffect(() => {
        if (provincias.length === 0) return;
        newGetCocineros()
    }, [provincias])

    const getDistritos = async () => {
        await fetch('/assets/distritos.min.json')
        .then((r) => r.json())
            .then((data) => {
                setProvincias(data.provincias)
            })
    }

    const newGetCocineros = async () => {

        setGettingData(true)

        const result = await service.getAllCocineros();

        if(result && !result.error){
            const cocineros = result.result
            cocineros.forEach((cocinero: any) => {
                if (!cocinero.provincia || !cocinero.canton || !cocinero.distrito) return;
                addressByPostalCode(cocinero.provincia, cocinero.canton, cocinero.distrito)
            })
        } else {
            console.log(result.error)
        }

        setGettingData(false)

    }

    const addressByPostalCode = (userProvincia: string, userCanton: string, userDistrito: string) => {
        const provincia = parseInt(userProvincia) == 0 ? 1 : parseInt(userProvincia);
        const canton = parseInt(userCanton) == 0 ? 1 : parseInt(userCanton);
        const distrito = parseInt(userDistrito) == 0 ? 1 : parseInt(userDistrito);

        const provinciaTitle = provincias[provincia - 1].title
        const cantonTitle = provincias[provincia - 1].cantones[canton - 1].title;
        const distritoTitle = provincias[provincia - 1].cantones[canton - 1].distritos[distrito - 1].title;

        const address = `${provinciaTitle}, ${cantonTitle}, ${distritoTitle}, Costa Rica`;
        const uriAddress = encodeURI(address);

        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${uriAddress}&key=${process.env.GOOGLEMAPS_KEY}`

        fetch(url)
        .then((r) => r.json())
            .then((data) => {
                let thisLocation = data.results[0].geometry.location
                setLocations((locations) => {
                    return locations.concat(thisLocation)
                })
            })
            .catch((e)=>{
                console.log(e)
            }
        )
    }


    return(<>
        <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title="Registros por código postal"/>
                        <CardContent></CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                        <Card>
                            <CardHeader title='Mapa' />
                            <CardContent>
                                {
                                    !gettingData && locations.length > 0 ?
                                    <div style={{ height: '100vh', width: '100%' }}>
                                        <GoogleMapReact          
                                            key={process.env.GOOGLEMAPS_KEY}
                                            defaultCenter={mapCenter}
                                            defaultZoom={8}
                                            heatmapLibrary={true}          
                                            heatmap={{
                                                positions: locations,
                                                options: {
                                                    radius: 20,
                                                    opacity: 0.6,
                                                }
                                            }}            
                                        />
                                    </div>
                                    :
                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%'}}>
                                        <CircularProgress />
                                    </div>
                                }
                            </CardContent>
                        </Card>
                </Grid>
        </Grid>
    </>)
}


export default RegistrosPorZona

