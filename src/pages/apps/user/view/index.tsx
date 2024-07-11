// ** Next Import
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage id='1' invoiceData={invoiceData} />
}

export const getStaticProps: GetStaticProps = async () => {
  const invoiceData: InvoiceType[] = []

  return {
    props: {
      invoiceData
    }
  }
}

export default UserView
