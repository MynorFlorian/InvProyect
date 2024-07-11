// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType, SuccesCallbackType } from './types'
import LoginService from 'src/services/LoginService'
import { UserData } from 'src/interfaces/objects/UserData'
import { Statics } from 'src/utils/statics'

// ** Defaults
const defaultProvider: AuthValuesType = {
    user: null,
    loading: true,
    setUser: () => null,
    setLoading: () => Boolean,
    isInitialized: false,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    setIsInitialized: () => Boolean,
    register: () => Promise.resolve(),
    enableUrl: false,

    // Role auth
    isAdmin: () => false,
    isMarketing: () => false,

    // User data
    getUserName: () => '',
    getFullUserName: () => '',
}

const AuthContext = createContext(defaultProvider)

type Props = {
    children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
    // ** States
    const [enableUrl, setEnableUrl] = useState<boolean>(false);
    const [user, setUser] = useState<UserData | null>(defaultProvider.user)
    const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
    const [isInitialized, setIsInitialized] = useState<boolean>(defaultProvider.isInitialized)

    // ** Hooks
    const router = useRouter()
    const service = new LoginService();

    useEffect(() => {
        const initAuth = async (): Promise<void> => {
            setIsInitialized(true)
            const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
            if (storedToken) {
                // let fcmresult = await service.fcmToken();

                setLoading(true)
                console.log({ Paso: 1 });

                // Block refresh for specifics routes
                let bloquedSubUrl: boolean = false;
                if(router && router.asPath){
                    bloquedSubUrl = !!Statics.instance.bloquedRefreshEndPoints.find(bloquedSubUrl => router.asPath.includes(bloquedSubUrl))
                    if(bloquedSubUrl) {
                        setLoading(false)
                        setEnableUrl(true);
                        setUser(null)
                    }
                }

                if(!bloquedSubUrl) {
                    let result = await service.refreshToken(storedToken);
                    if(result && !result.error && result.result) {
                        setUser({ ...result.result })
                    } else {
                        localStorage.removeItem('userData')
                        localStorage.removeItem('refreshToken')
                        localStorage.removeItem('accessToken')
                        setUser(null)
                    }
                }
            }
            setLoading(false)
        }
        initAuth()
    }, [])

    const handleLogin = async  (params: LoginParams, errorCallback?: ErrCallbackType) => {
        try {
            let { email, password } = params;
            console.log(email, password);
            
            if(email && password) {
                let result = await service.login(`${email}`.trim(), password.trim());
                console.log({result});
                if(!result || result.error) throw new Error(result.message);
                router.replace('/dashboard')

                // Reload page to charge all data
                setTimeout(() => { router.reload(); }, 1000)
            }
            else {
                throw new Error("Ingrese un correo y contraseña validos.");
            }
        } catch (error: any) {
            console.log('Error al realizar login: ' + error);
            if (errorCallback) errorCallback(error);
        }
    }

    const handleLogout = () => {
        setUser(null)
        setIsInitialized(false)
        window.localStorage.removeItem('userData')
        window.localStorage.removeItem(authConfig.storageTokenKeyName)
        router.push('/login')
    }

    const handleRegister = async (params: RegisterParams, errorCallback?: ErrCallbackType, onSuccesCallback?: SuccesCallbackType ) => {
        try {
            params.password = params.password.trim();
            params.telefono = params.telefono.trim();

            let type = params.type;

            //remove params.type
            delete params.type;


            if(params.password && params.telefono) {
                // TODO: change user to create
                let result = await service.registerUser(params, type);
                if(!result || result.error){
                    throw new Error(result.message);
                }else{
                    if(onSuccesCallback) onSuccesCallback(result.result);
                }

                //router.replace('/login')
                return result;

                // Reload page to charge all data
                // setTimeout(() => { router.reload(); }, 1000)
            }
            else {
                throw new Error("Ingrese un teléfono y contraseña validos.");
            }
        } catch (error: any) {
            console.log('Error al realizar login: ' + error.message);
            if (errorCallback) errorCallback(error);
        }

    }

    // Auth role
    const isAdmin = () => {
        return valudateRole('admin');
    };

    const isMarketing = () => {
        return valudateRole('marketing');
    }

    const valudateRole = (tipo: string) => {
        // return !!user && !!user.RolesUsuario && user.RolesUsuario.length > 0 && !!user.RolesUsuario[0].Rol && user.RolesUsuario[0].Rol.tipo == tipo;
        return true
    }

    // User data
    const getUserName = () => {
        let name = '';
        if(user) {
            name += user.nombre && user.nombre.includes(' ') ? user.nombre.split(' ')[0] : user.nombre;
            if(name && name.length) name += ' ';
        }
        return name;
    }

    const getFullUserName = () => {
        let name = '';
        if(user) {
            name += user.nombre ? user.nombre : '';
            if(name && name.length) name += ' ';
        }
        return name;
    }

    // Set auth values
    const values = {
        user,
        loading,
        setUser,
        setLoading,
        isInitialized,
        setIsInitialized,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,

        // Role
        isAdmin: isAdmin,
        isMarketing: isMarketing,
        enableUrl,

        // User data
        getUserName: getUserName,
        getFullUserName: getFullUserName,
    }

    // Return all values
    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
