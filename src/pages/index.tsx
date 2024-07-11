// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Spinner Import
import Spinner from 'src/@core/components/spinner'

// ** Hook Imports
import { useAuth } from 'src/hooks/useAuth'
import { RolData } from 'src/interfaces/objects/RolData'


/**
 *  Set Home URL based on User Roles
 */
export const getHomeRoute = (role: RolData) => {
    if (role && role.tipo) return '/dashboard'
    else return '/login'
}

const Home = () => {
    // ** Hooks
    const auth = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) {
            return
        }

        // if (auth.user && auth.user.Rol) {
            // const homeRoute = getHomeRoute(auth.user.Rol)

            // Redirect user to Home URL
            router.replace('/dashboard')
        // }

        if(router.pathname == '/'){
            router.replace('/dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
            <Spinner />
    )
}

export default Home
