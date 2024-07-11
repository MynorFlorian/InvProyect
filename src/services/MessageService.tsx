import http from 'src/utils/http';
import { Statics } from 'src/utils/statics';
import { LocaleStorage } from 'src/utils/localeStorage';
import { UserData } from 'src/interfaces/objects/UserData'
import { MassMessage } from 'src/interfaces/objects/MassMessage'
import { getUrlUpload } from 'src/utils/aws';
import { ParamsCodigoRegisto } from 'src/interfaces/objects/ParametrosCodigoRegisto';
import { MensajeData } from 'src/interfaces/objects/MensajeData';

export default class MessageService {
    storage = new LocaleStorage()
    connection = new http()

    private subUrl: string = Statics.instance.urlBase + Statics.instance.mensajeUrl;

    async listByChat(id: number){
        try {
            //Doesn't need data 'cause is only to obtain account info
            let url = this.subUrl + "/chat" + `/${id}`
            await this.connection.buildHeaders()
            let result = await this.connection.get(url, true)


            return{error: result.error, mensaje: result.message, result: result.result, count: result.count}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario.' }
        }
    }

    async create(data: MensajeData, queryParams: string = '') {
        try {

            // Url construction
            let url = this.subUrl + `/${queryParams}`;

            // Send request
            await this.connection.buildHeaders();
            let result: any = await this.connection.post(url, data, true);
            return { error: result.error, mensaje: result.message, result: result.result }
        } catch (error: any) {
            return { error: true, mensaje: error.message }
        }
    }
}
