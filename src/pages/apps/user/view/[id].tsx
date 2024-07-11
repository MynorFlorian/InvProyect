// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Types
import { InvoiceType } from 'src/types/apps/invoiceTypes'

// ** Demo Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage'

const UserView = ({ id, invoiceData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <UserViewPage id={id} invoiceData={invoiceData} />
}

export const getStaticPaths: GetStaticPaths = async () => {

  return {
    paths: [],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }: GetStaticPropsContext) => {
  const invoiceData: InvoiceType[] = []

  return {
    props: {
      invoiceData,
      id: params?.id
    }
  }
}

export default UserView
