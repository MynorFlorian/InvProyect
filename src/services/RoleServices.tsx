import http from 'src/utils/http';
import { Statics } from 'src/utils/statics';
import { LocaleStorage } from 'src/utils/localeStorage';

export default class RolesService {
    storage = new LocaleStorage();
    connection = new http();

    private serviceName: string = 'Roles';
    private subUrl: string = Statics.instance.urlBase + Statics.instance.rolesUrl;

    get = async () => {
        try {
            const ruta = this.subUrl + '/'

            this.connection.buildHeaders();
            let req = await this.connection.get(ruta, true)
            if (req.error) throw new Error(req.result.message)

            return { error: req.error, message: '', result: req.result }
        } catch (error: any) {
            console.log('Create User service error', error)
            return { error: true, message: error.message, result: null }
        }

    }
}
