// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import TabPlatillosList from 'src/views/pages/account-settings/TabPlatillosList'
import TabPagosList from 'src/views/pages/account-settings/TabPagosList'
import TabDireccionesList from 'src/views/pages/account-settings/TabDireccionesList'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'
import UserService from 'src/services/UserService'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { FileAccountOutline, BellOutline, LockOutline, FileCabinet, FormatListBulleted } from 'mdi-material-ui'

// ** Demo Tabs Imports
import TabAccount from 'src/views/pages/account-settings/TabAccount'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import PlatilloService from 'src/services/PlatilloService'
import TabPlatilloEdit from 'src/views/pages/account-settings/TabPlatilloEdit'

const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        minWidth: 100
    },
    [theme.breakpoints.down('sm')]: {
        minWidth: 67
    }
}))


const TabName = styled('span')(({ theme }) => ({
    lineHeight: 1.71,
    fontSize: '0.875rem',
    marginLeft: theme.spacing(2.4),
    [theme.breakpoints.down('md')]: {
        display: 'none'
    }
}))
  

const PlatilloEdit = () =>{

    const [value, setValue] = useState<string>("edicion")

    const router = useRouter();
    const { id } = router.query;
    const service = new PlatilloService()

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }


    return(<>
        <Card>
            <TabContext value={value}>
                <TabList
                    onChange={handleChange}
                    aria-label='account-settings tabs'
                    sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}                    
                >
                    <Tab
                        value='edicion'
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountOutline />
                                <TabName>Datos Platillo</TabName>
                            </Box>
                        }
                    />


                </TabList>

                {id && !isNaN(+id) && <TabPanel sx={{ p: 0 }} value='edicion'>
                        
                        <TabPlatilloEdit IdPlatillo={+id}/>
                </TabPanel>}
            </TabContext>
        </Card>
    </>)
}

export default PlatilloEdit