// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports

// ** Type Import

// ** Custom Components Imports

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import CrmTotalSales from 'src/views/dashboards/crm/CrmTotalSales'
import CrmStatisticsCard from 'src/views/dashboards/crm/CrmStatisticsCard'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect } from 'react'
import UserService from 'src/services/UserService'
import ConteoStatus from 'src/views/dashboards/crm/ConteoStatusCocinero'
import router from 'next/router'

const CRMDashboard = () => {

    const usersService = new UserService();

    // * Hooks *
    const auth = useAuth();

    // if (auth.isMarketing()) {
    //     router.push('/users/list/influencers');
    // }

    useEffect(() => {
        chargeData();
    }, [])

    const chargeData = () => {
        test();
    }

    const test = async () => {
        // let result = await usersService.getUrlToUpload('test.jpg', 'jpg');
        // console.log(result);
    }

    return (
        <ApexChartWrapper>
            {/* Supervisores */}
            {
                auth.isAdmin() ?
                <Grid container spacing={6}>
                    {/* Ventas totales */}
                    <Grid item xs={12} sm={6} md={6}>
                        <CrmTotalSales />
                    </Grid>

                    {/* Contadores */}
                    {/* <Grid item xs={12} md={6}>
                        <CrmStatisticsCard />
                    </Grid> */}

                    {/* Conteo status cocineros */}
                    <Grid item xs={12} md={6}>
                        <ConteoStatus />
                    </Grid>
                </Grid>
                : null
            }
        </ApexChartWrapper>
    )
}

export default CRMDashboard
