// ** React Imports
import { ReactNode, useState, SyntheticEvent } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { Card, List, SliderValueLabel } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab' 
import MuiTab, { TabProps } from '@mui/material/Tab'
import ListadoClientes from 'src/views/clients/Listado'

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

const Clientes = () => {

  const [value, setValue] = useState<string>('listado')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

    return(
    <Card>
      <TabContext value={value}>
        <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='listado'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <List />
                <TabName>Listado de Clientes</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel
          sx={{p:0}}
          value='listado'
        >
          <ListadoClientes />
        </TabPanel>
      </TabContext>
    </Card>
    )
}

// Clientes.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Clientes