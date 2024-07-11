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

const service = new PedidoService();


interface State{

}

interface Props{
    UsuarioId: number
}

interface CellType{
    row: PedidoData
}


const RowOptions = () =>{

    return(<>
    </>)
}

const defaultColumns = [
    {
        flex: 0.25,
        minWidth: 230,
        field: 'fullName',
        headerName: 'Id de pedido',
        renderCell: ({ row }: CellType) => {
        const { id } = row
        const fullName = id;

        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderPedidoId(id?id:0)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                <Typography
                    noWrap
                    component='a'
                    variant='body2'
                    sx={{ fontWeight: 600, color: 'text.primary', textDecoration: 'none' }}
                >
                    {fullName}
                </Typography>
            </Box>
            </Box>
        )
        }
    },

        // Costo
    {
        flex: 0.25,
        field: 'string',
        minWidth: 250,
        headerName: 'Status',
        renderCell: ({ row }: CellType) => {
            return (
                <Typography noWrap variant='body2'>
                    {row.status}
                </Typography>
            )
        }
    },

]

const renderPedidoId = (id:number) =>{
    return(<>
        <CustomAvatar
            skin='light'
            color={'primary'}
            sx={{ mr: 3, width: 30, height: 30, fontSize: '.875rem' }}
        >
            {id ? getInitials(id+"") : '0'}
        </CustomAvatar>
    </>)
}



const TabPedidosList = ({UsuarioId}:Props) =>{

    const [pageSize, setPageSize] = useState<number>(10)
    const [countRegisters, setCountRegisters] = useState<number>(0)
    const [currentPage, setCurrentPage] = useState<number>(0)
    const [currentDataPage, setCurrentDataPage] = useState<PlatilloData[]>([])

    useEffect(()=>{
        getPage(1)
    }, [])


    const getPage = async(page:number=0)=>{
        let query = '?';
        query += `page=${page}`;
        query += `&size=${pageSize}`;
        query += `&CocineroId=${UsuarioId}`
        //query += `&size=${UsuarioId}`

        let result = await service.getAllPagos(UsuarioId, query)

        if(result && !result.error && result.result){

            let records: PlatilloData[] = result.result;
            setCurrentDataPage(records);
            setCurrentPage(page);
            setCountRegisters(result.count);

        }else{
            let error = `Error al obtener datos: ${result.mensaje}`;
            console.log("Erroraso",error);
        }        
    }

    return(<>
        <CardContent sx={{ paddingBottom: 0 }}>
            <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='Historial de Pedidos' />
                    </Card>
                </Grid>
                
                {/* List of data */}
                <Grid item xs={12}>
                    <Card>
                        <DataGrid
                            autoHeight
                            rows={currentDataPage}
                            checkboxSelection
                            pageSize={pageSize}
                            disableSelectionOnClick
                            columns={defaultColumns}
                            rowsPerPageOptions={[10, 25, 50]}
                            onPageSizeChange={newPageSize => setPageSize(newPageSize)}
                            page={currentPage}
                            onPageChange={newPage => getPage(newPage)}
                            rowCount={countRegisters}
                        />
                    </Card>
                </Grid>
            </Grid>
        </CardContent>
    </>)
}

export default TabPedidosList