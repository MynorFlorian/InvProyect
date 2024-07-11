// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next/types'

// ** Types
import { MailLayoutType, MailType } from 'src/types/apps/emailTypes'

// ** Demo Components Imports
import Email from 'src/views/apps/email/Email'

const EmailApp = ({ label }: MailLayoutType) => {
  return <Email label={label} />
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
      ...(params && params.label ? { label: params.label } : {})
    }
  }
}

export default EmailApp
