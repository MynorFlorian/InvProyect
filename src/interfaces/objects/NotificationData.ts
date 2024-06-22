import { UserData } from './UserData';

export interface NotificationData {
    titulo?: string;
    mensaje?: string;
    status?: string;

    UsuarioId?: number;

    Usuario?: UserData;
}
