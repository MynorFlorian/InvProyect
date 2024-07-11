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
import FileDocumentMultipleOutline from 'mdi-material-ui/FileDocumentMultipleOutline'
import { FileAccountOutline, BellOutline, LockOutline, FileCabinet, FormatListBulleted, LinkPlus } from 'mdi-material-ui'

// ** Demo Tabs Imports
import TabAccount from 'src/views/pages/account-settings/TabAccount'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import TabChangePassword from 'src/views/pages/account-settings/TabChangePassword'
import TabPedidosList from 'src/views/pages/account-settings/TabPedidosList'
import TabDocuments from 'src/views/pages/account-settings/TabDocuments'
import Link from 'src/@core/theme/overrides/link'
import TabLinks from 'src/views/pages/account-settings/TabLinks'

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

const AccountEdit = () => {
    // ** State
    const [value, setValue] = useState<string>('account')
    const [isCocinero, setIsCocinero] = useState(false)
    const [isClient, setIsClient] = useState(false)
    const [isDelivery, setIsDelivery] = useState(false)
    const [isInfluncer, setIsInfluencer] = useState<boolean>(false)
    const router = useRouter();
    const { id, position } = router.query;
    const service = new UserService()

    useEffect(() =>{
        getDataUser()

        if(position == "platillos"){
            setValue('list-platillos')
        }

    },[])



    const getDataUser = () =>{
        if(id){
            service.getAccount(Number(id)).then((res)=>{

                if(!res.error && res.result && res.result.RolesUsuario){
                    try {
                        setIsCocinero((e)=>{
                            if(res.result.RolesUsuario[0].RolId == 1){
                                return true
                            }
                            return false
                        })
                        setIsClient((e) =>{
                            if(res.result.RolesUsuario[0].RolId == 2){
                                return true
                            }
                            return false
                        })
                        setIsDelivery((e) =>{
                            if(res.result.RolesUsuario[0].RolId == 3){
                                return true
                            }
                            return false
                        })

                        setIsInfluencer(() =>{
                            if(res.result.RolesUsuario[0].RolId == 5){
                                return true
                            }
                            return false
                        })
                    } catch (error) {
                        alert("Error capturando datos de usuario, revisar rapido.")
                    }


                }else{
                    alert("No se pudo obtener informacion de este usuario")
                }
            })
        }


    }

    const handleChange = (event: SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    return (
        <Card>
            <TabContext value={value}>
                <TabList
                    onChange={handleChange}
                    aria-label='account-settings tabs'
                    sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
                >
                    {/* Cuenta */}
                    <Tab
                        value='account'
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountOutline />
                                <TabName>Datos Generales</TabName>
                            </Box>
                        }
                    />

                    {/* Documentos */}
                    {
                        id && (isCocinero || isDelivery) ?
                        <Tab
                            value='documents'
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FileDocumentMultipleOutline />
                                    <TabName>Documentos</TabName>
                                </Box>
                            }
                        /> : null
                    }

                    {/* Cambiar contraseña */}
                    {
                        id ?
                        <Tab
                            value='change-password'
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LockOutline />
                                    <TabName>Cambiar contraseña</TabName>
                                </Box>
                            }
                        /> : null
                    }

                    {/**Listado de platilos */}
                    {
                        id && isCocinero ?
                        <Tab
                            value='list-platillos'
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {/**Agregar lista */}
                                    <FormatListBulleted />
                                    <TabName>Listado Platillos</TabName>
                                </Box>
                            }
                        /> : null
                    }

                    {/**Listado de direcciones */}
                    {
                        id && isCocinero ?
                        <Tab
                            value="list-direcciones"
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FormatListBulleted />
                                    <TabName>Listado de direcciones</TabName>
                                </Box>
                            }
                        /> : null
                    }

                    {/**Lista de pagos */}
                    {
                        id && isClient ?
                        <Tab
                            value='list-pagos'
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {/**Agregar lista */}
                                    <FormatListBulleted />
                                    <TabName>
                                        Listado de pagos
                                    </TabName>
                                </Box>
                            }
                        /> : null
                    }

                    {/**Lista de pedidos */}
                    {
                        id && isClient ?
                        <Tab
                            value='pedidos-list'
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FormatListBulleted />
                                    <TabName>
                                        Lista de pedidos
                                    </TabName>
                                </Box>
                            }
                        />
                        : null
                    }

                    {/**Informacion de links de influecner */}

                    {
                        id && isInfluncer ?
                        <Tab
                            value='links-influencer'
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LinkPlus />
                                    <TabName>
                                        Links Influencer
                                    </TabName>
                                </Box>
                            }
                        />
                        :
                        null
                    }
                </TabList>

                {/* Cuenta */}
                <TabPanel sx={{ p: 0 }} value='account'>
                    <TabAccount rolTab={isCocinero ? 'cocinero' : undefined} UsuarioId={id && !isNaN(+id) ? +id : undefined}/>
                </TabPanel>

                {/* Documentos */}
                {
                    id && !isNaN(+id) && (isCocinero || isDelivery) ?
                    <TabPanel sx={{ p: 0 }} value='documents'>
                        <TabDocuments UsuarioId={+id} />
                    </TabPanel>
                    : null
                }

                {/* Cambiar contraseña */}
                {
                    id && !isNaN(+id)?
                    <TabPanel sx={{ p: 0 }} value='change-password'>
                        <TabChangePassword UsuarioId={+id}/>
                    </TabPanel>
                    :
                    null
                }

                {/**Listado de platillos */}
                {
                    id && !isNaN(+id) && isCocinero ?
                    <TabPanel sx={{ p: 0 }} value='list-platillos'>
                        <TabPlatillosList UsuarioId={+id} />
                    </TabPanel> : null
                }

                {/**Listado de direcciones */}

                {
                    id && !isNaN(+id) && isCocinero ?
                    <TabPanel sx={{ p: 0 }} value='list-direcciones'>
                        <TabDireccionesList UsuarioId={+id} />
                    </TabPanel> : null
                }

                {/**Listado de pagos */}
                {
                    id && !isNaN(+id) && isClient ?
                    <TabPanel sx={{ p: 0 }} value='list-pagos'>
                        <TabPagosList UsuarioId={+id} />
                    </TabPanel> :null
                }

                {/**Lista de pedidos */}
                {
                    id && !isNaN(+id) && isClient ?
                    <TabPanel sx={{ p: 0 }} value='pedidos-list'>
                        <TabPedidosList UsuarioId={+id} />
                    </TabPanel> : null
                }

                {
                    id && !isNaN(+id) && isInfluncer ?
                    <TabPanel sx={{ p: 0 }} value='links-influencer'>
                        <TabLinks UsuarioId={+id} />
                    </TabPanel>
                    : null
                }
            </TabContext>
        </Card>
    )
}

export default AccountEdit
