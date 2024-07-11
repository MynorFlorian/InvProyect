// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid'
import CardHeader from '@mui/material/CardHeader'

// ** Data Import


const columns = [
  {
    field: 'id',
    headerName: 'ID'
  },
  {
    minWidth: 300,
    field: 'full_name',
    headerName: 'Name'
  },
  {
    minWidth: 300,
    field: 'email',
    headerName: 'Email'
  },
  {
    width: 180,
    field: 'start_date',
    headerName: 'Date'
  },
  {
    width: 180,
    field: 'experience',
    headerName: 'Experience'
  },
  {
    field: 'age',
    headerName: 'Age'
  }
]

const TableBasic = () => {
  return (
    <Card>
      <CardHeader title='Basic' />
      <Box sx={{ height: 500 }}>
        <DataGrid columns={columns} rows={[]} />
      </Box>
    </Card>
  )
}

export default TableBasic
