import { RolData } from "src/interfaces/objects/RolData"
import { UserData } from "src/interfaces/objects/UserData"
import { NotificationData } from "src/interfaces/objects/NotificationData"

export type ErrCallbackType = (err: { [key: string]: string }) => void

export type SuccesCallbackType = (data: any) => void

export type LoginParams = {
    email: string | number
    password: string
}

export type RegisterParams = {
    nombre: string;
    telefono: string;
    correo?: string,
    fechaNacimiento: Date | undefined;
    dni: string;
    password: string,
    type?: string
}

export type UserDataType = {
    id: number,
    nombre: string;
    telefono?: string;
    correo?: string,
    hash: string;
    imagenUsuario?: string,
    activada: boolean;
    eliminado: boolean;
    correoValido: boolean,
    telefonoValido: boolean,
    codigoAuxiliar?: string;
    codigoReferido?:string;
    consumidorStripe?:string;
    categorias?: string;
    Rol: RolData
};

export type AuthValuesType = {
    loading: boolean
    setLoading: (value: boolean) => void
    logout: () => void
    isInitialized: boolean
    user: UserData | null
    setUser: (value: UserData | null) => void
    setIsInitialized: (value: boolean) => void
    login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
    register: (params: RegisterParams, errorCallback?: ErrCallbackType, onSuccesCallback?: SuccesCallbackType) => void

    // Role auth
    isAdmin: () => boolean
    isMarketing: () => boolean
    enableUrl: boolean,

    // User data
    getUserName: () => string
    getFullUserName: () => string
}

export type NotificationsType = {
    loading: boolean
    setLoading: (value: boolean) => void
    isInitialized: boolean
    setIsInitialized: (value: boolean) => void
    notifications: NotificationData | {}
    setNotifications: (value: NotificationData | {}) => void
}

