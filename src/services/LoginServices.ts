import http from 'src/utils/http';
import { Statics } from 'src/utils/statics';
import { LocaleStorage } from 'src/utils/localeStorage';
import localforage from "localforage";

// ** Config
import authConfig from 'src/configs/auth'
import { UserData } from 'src/interfaces/objects/UserData';

export default class LoginService {
    storage = new LocaleStorage();
    connection = new http();

    async login(username: string, password: string) {
        try {
            // Construction data
            let data = {
                username: username,
                password: password
            }

            // Url construction
            let url = Statics.instance.baseRoute + Statics.instance.userRoute + '/login-web';

            // Send request
            await this.connection.buildHeaders();
            let result: any = await this.connection.post(url, data);
            console.log({resultLogin: result});

            // Validate result
            if(!result || result.error) throw new Error(result.message);

            // Parse data
            let { token, user, rol } = result;
            if(!token || !user || !rol) throw new Error('Error al obtener credenciales iniciales.');

            // Save data
            await this.storage.recordUser(user);
            await this.storage.recordToken({ token, rolType: rol });
            await window.localStorage.setItem('userData', JSON.stringify(user));
            await window.localStorage.setItem(authConfig.storageTokenKeyName, token)

            return { error: result.error, message: '', result: result.data }
        } catch (error: any) {
            console.log('Login service error: ', error.message)
            return { error: true, mensaje: error.message }
        }
    }

    async refreshToken(oldToken: string) {
        try {
            // Construction data
            let data: any = { token: oldToken };

            // Url construction
            let url = Statics.instance.baseRoute + Statics.instance.userRoute + '/refreshLogin';

            // Send request
            await this.connection.buildHeaders();
            let result: any = await this.connection.post(url, data, true);

            // Validate result
            if(!result || result.error) throw new Error(result.message);

            // Parse data
            let { token, user, rol } = result;
            if(!token || !user || !rol) throw new Error('Error al obtener credenciales iniciales.');

            // Save data
            await this.storage.recordUser(user);
            await this.storage.recordToken({ token, rolType: rol });
            await window.localStorage.setItem('userData', JSON.stringify(user));
            await window.localStorage.setItem(authConfig.storageTokenKeyName, token)

            return { error: result.error, message: '', result: user }
        } catch (error: any) {
            console.log('Login service error: ', error.message)
            return { error: true, mensaje: error.message }
        }
    }

    async fcmToken() {
        try {
            // Construction data
            let tokenInLocalForage = await localforage.getItem("fcm_token");
            let webToken = await this.storage.getToken();
            let data: any = { fcmtoken: tokenInLocalForage, userToken: webToken };

            // Url construction
            let url = Statics.instance.baseRoute + Statics.instance.userRoute + '/saveWebToken';
            console.log('url: ', url)

            // Send request
            await this.connection.buildHeaders();
            let result: any = await this.connection.post(url, data, true);

            // Validate result
            if(!result || result.error) throw new Error(result.message);

            return { error: result.error, message: '', result: result.data }
        } catch (error: any) {
            console.log('Error con el token FCM: ', error.message)
            return { error: true, mensaje: error.message }
        }
    }

    async register(user: UserData) {
        try {
            // Construction data
            let data = user;

            // Url construction
            let url = Statics.instance.baseRoute + Statics.instance.userRoute + '/registrar';

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.post(url, data);

            return { error: result.error, mensaje: result.message, result: result.result, validation: result }
        } catch (error: any) {
            //console.warn('Register service error: ', error.message)
            return { error: true, mensaje: 'Error al crear Usuario' }
        }

    }

    async registerUser(user: any, tipo: string | undefined = undefined) {
        try {
            // Construction data
            let data = user;
            if(tipo) data.tipoUser = tipo;

            // Url construction
            let url = Statics.instance.baseRoute + Statics.instance.userRoute + '/registro-web';

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.post(url, data);

            return { error: result.error, message: result.message, result: result.result }
        } catch (error: any) {
            //console.warn('Register service error: ', error.message)
            return { error: true, mensaje: 'Error al crear Usuario' }
        }
    }

}