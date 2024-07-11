// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next/types'

// ** Types
import { MailLayoutType, MailType } from 'src/types/apps/emailTypes'

// ** Demo Components Imports
import Email from 'src/views/apps/email/Email'

const EmailApp = ({ folder }: MailLayoutType) => {
  return <Email folder={folder} />
}

export const getStaticPaths: GetStaticPaths = async () => {

  return {
    paths: [],
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      folder: params?.folder
    }
  }
}

export default EmailApp
