// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Types
import { NotificationsType, ErrCallbackType } from './types'
import UserService from 'src/services/UserService'
import { NotificationData } from 'src/interfaces/objects/NotificationData'
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider: any = {
    loading: true,
    setLoading: () => Boolean,
    isInitialized: false,
    setIsInitialized: () => Boolean,
    notifications: [],
    setNotifications: () => [],
    createNotification: () => Promise.resolve(),
}

const NotificationsContext = createContext(defaultProvider)

type Props = {
    children: ReactNode
}

const NotificationsProvider = ({ children }: Props) => {
    // ** States
    const [notifications, setNotifications] = useState<any | []>(defaultProvider.notifications)
    const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
    const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

    // ** Hooks
    const service = new UserService();

    useEffect(() => {
        const initAuth = async (): Promise<void> => {
            const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
            setIsInitialized(true)
            if(storedToken){
                setLoading(true)
                console.log('initAuth notification')
                let result = await service.getUserNotifications();
                if(result && !result.error && result.result) {
                    setLoading(false)
                    setNotifications({ ...result.result })
                } else {
                    setNotifications([])
                    setLoading(false)
                }
            }
        }
        initAuth()
    }, [])

    /*const handleLogin = async  (params: LoginParams, errorCallback?: ErrCallbackType) => {
        try {
            let { email, password } = params;
            if(email && password) {
                let result = await service.login(`${email}`.trim(), password.trim());
                if(!result || result.error) throw new Error(result.message);
                router.replace('/dashboard')

                // Reload page to charge all data
                setTimeout(() => { router.reload(); }, 1000)
            }
            else {
                throw new Error("Ingrese un correo y contraseña validos.");
            }
        } catch (error: any) {
            console.log('Error al realizar login: ' + error.message);
            if (errorCallback) errorCallback(error);
        }
    }*/

    const handleCreateNotification = async (params: NotificationData, errorCallback?: ErrCallbackType) => {
        try {
            let { titulo, mensaje } = params;
            if(titulo && mensaje) {
                let result = await service.createNotification(titulo, mensaje);
                if(!result || result.error) throw new Error(result.mensaje);
                setNotifications([...notifications, result.result])
            }
            else {
                throw new Error("No se pudo crear porque faltan datos");
            }
        } catch (error: any) {
            console.log('Error al crear notificacion: ' + error.message);
            if (errorCallback) errorCallback(error);
        }
    }


    // Set auth values
    const values = {
        loading,
        setLoading,
        isInitialized,
        setIsInitialized,
        notifications,
        setNotifications,
        createNotification: handleCreateNotification,
    }

    // Return all values
    return <NotificationsContext.Provider value={values}>{children}</NotificationsContext.Provider>
}

export { NotificationsContext, NotificationsProvider }
