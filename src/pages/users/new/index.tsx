// ** React Imports
import { SyntheticEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab, { TabProps } from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Demo Tabs Imports
import TabAccount from 'src/views/pages/account-settings/TabAccount'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import { Statics } from 'src/utils/statics'

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

const AccountSettings = () => {
    // ** State
    const [value, setValue] = useState<string>('account')
    const [tipo, setTipo] = useState("") 

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }
    
    let router = useRouter()

    const updateTipo = () =>{
        setTipo((e: any)=>{
            let queryTipo = `${router.query["tipo"]}` ?? "cliente"
            console.log("IMPRIME",queryTipo)
            return queryTipo 
        })
    }

    useEffect(() =>{
        setTipo("")
        if(router.isReady) setTimeout(updateTipo,50);
        
    },[router.route, router.query])

    return (
        <Card>
            <TabContext value={value}>
                <TabList
                    onChange={handleChange}
                    aria-label='account-settings tabs'
                    sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                >
                    {/* Account */}
                    <Tab
                        value='account'
                        label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccountOutline />
                            <TabName>Nuevo {tipo}</TabName>
                        </Box>
                        }
                    />
                    
                </TabList>

                <TabPanel sx={{ p: 0 }} value='account'>
                    {/* Account */}
                    {tipo ? <TabAccount rolTab={`${tipo}`} />
                    : null}
                </TabPanel>


            </TabContext>
        </Card>
    )
}

export default AccountSettings
