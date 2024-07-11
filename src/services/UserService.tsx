import http from 'src/utils/http';
import { Statics } from 'src/utils/statics';
import { LocaleStorage } from 'src/utils/localeStorage';
import { UserData } from 'src/interfaces/objects/UserData'
import { MassMessage } from 'src/interfaces/objects/MassMessage'
import { getUrlUpload } from 'src/utils/aws';
import { ParamsCodigoRegisto } from 'src/interfaces/objects/ParametrosCodigoRegisto';

export default class UserService {
    storage = new LocaleStorage()
    connection = new http()

    async updateAccount(usuario: UserData){
        try {

            // Update data
            let data = usuario;

            // URL construction
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/${usuario.id}`;

            // Result info
            await this.connection.buildHeaders()
            let result = await this.connection.put(url, data, true)

            return {error: result.error, mensaje: result.message, result: true}
        } catch (error) {
            return { error: true, mensaje: 'Error al editar información de usuario.' }
        }
    }

    async updatePassword(UsuarioId: number, password: string){
        try {

            // Update data
            let data = {
                password
            };

            // URL construction
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/resetpassword/${UsuarioId}`;

            // Result info
            await this.connection.buildHeaders()
            let result = await this.connection.post(url, data, true)

            return {error: result.error, mensaje: result.message, result: true}
        } catch (error) {
            return { error: true, mensaje: 'Error al editar información de usuario.' }
        }
    }

    async sendTemporalPassword(UsuarioId : number){
        try {
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/password-temporal/${UsuarioId}`

            let data = {}
            await this.connection.buildHeaders()

            let result = await this.connection.post(url, data, true)

            return {error: result.error, mensaje: result.message, result: true}
        } catch (error) {
            return { error: true, message: 'Error al enviar contrasenia temporal' }
        }
    }

    async getAccount(id: number){
        try {
            //Doesn't need data 'cause is only to obtain account info
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/getUserInfo/${id}`

            await this.connection.buildHeaders()
            let result = await this.connection.get(url, true)

            return{error: result.error, mensaje: result.message, result: result.result}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario.' }
        }
    }

    async getAll(query: string = ''){
        try {
            //Doesn't need data 'cause is only to obtain account info
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/${query}`

            await this.connection.buildHeaders()
            let result = await this.connection.get(url, true)

            //console.log(result.result)

            return{error: result.error, mensaje: result.message, result: result.result, count: result.count}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario.' }
        }
    }

    async getAllCocineros(){
        try {

            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/getCocinerosMapa`

            console.log(url)

            await this.connection.buildHeaders()
            let result = await this.connection.get(url, true)

            return {error: result.error, mensaje: result.message, result: result.result, count: result.count}

        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario.' }
        }
    }

    async searchUser(query:string=''){
        try {
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/${query}`

            await this.connection.buildHeaders()
            let result = await this.connection.get(url, true)

            //console.log(result.result)

            return{error: result.error, mensaje: result.message, result: result.result, count: result.count}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario.' }
        }
    }



    async create(user: UserData, rolUsuarioCreado:string|undefined) {
        try {
            // Construction data
            let data = user;

            if(rolUsuarioCreado == Statics.instance.DELIVERY_USER){
                data.tipoUser = Statics.instance.DELIVERY_USER
            }else if(rolUsuarioCreado == Statics.instance.CLIENTE_USER){
                data.tipoUser = Statics.instance.CLIENTE_USER
            }else if(rolUsuarioCreado == Statics.instance.COCINERO_USER){
                data.tipoUser = Statics.instance.COCINERO_USER
            }else if(rolUsuarioCreado == Statics.instance.INFLUENCER_USER){
                data.tipoUser = Statics.instance.INFLUENCER_USER
            }
            else{
                data.tipoUser = Statics.instance.ADMIN_USER
            }

            console.log(data)

            // Url construction
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + '/registro-web';

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.post(url, data);

            return { error: result.error, mensaje: result.message, result: result.result, validation: result }
        } catch (error: any) {
            //console.warn('Register service error: ', error.message)
            return { error: true, mensaje: 'Error al crear Usuario' }
        }
    }

    async sendMassMessage(message: MassMessage) {
        try {
            // Assign data to variable
            let data = message;

            // Url construction
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/mensajeMasivo`;

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.post(url, data, true);

            return { error: result.error, mensaje: result.message, result: result.result }

        } catch (error: any) {
            return { error: true, mensaje: 'Error al enviar mensaje' }
        }
    }

    async getRegisterCode(params: ParamsCodigoRegisto){

        try {
            // Assign data to variable
            let data = params;

            //url construction
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/codigoRegistro`;
            console.log(url, data)

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.post(url, data);

            return { error: result.error, mensaje: result.message, result: result.result }
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener código' }
        }

    }

    async blockUser(phone: string, dni: string){
        try {
            // Assign data to variable
            let data = {
                telefono: phone,
                dni: dni
            };

            //url construction
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/bloquearUsuario`;

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.post(url, data, true);

            return { error: result.error, mensaje: result.message, result: result.result }
        } catch (error) {
            return { error: true, mensaje: 'Error al bloquear usuario' }
        }
    }

    async createNotification(titulo: string, mensaje: string){
        try {
            // Assign data to variable
            let data = {
                titulo: titulo,
                mensaje: mensaje
            };

            //url construction
            let url = Statics.instance.urlBase + Statics.instance.notificacionesUrl + `/crear`;

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.post(url, data, true);

            return { error: result.error, mensaje: result.message, result: result.result }
        } catch (error) {
            return { error: true, mensaje: 'Error al crear notificación' }
        }
    }

    async getUserNotifications(){

        try {

            let url = Statics.instance.urlBase + Statics.instance.notificacionesUrl;
            console.log(url)

            // Send request
            await this.connection.buildHeaders();
            let result = await this.connection.get(url, true);

            return { error: result.error, mensaje: result.message, result: result.result }

        } catch (error) {
            return { error: true, mensaje: 'Error al obtener notificaciones' }
        }

    }

    async getUrlToUpload(fileName: string, type: string){
        try {
            let data = {
                fileName,
                type
            };

            //Doesn't need data 'cause is only to obtain account info
            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/url-upload`

            await this.connection.buildHeaders()
            let result = await this.connection.post(url, data, true)

            return{error: result.error, mensaje: result.message, result: result.result}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario.' }
        }
    }

    async uploadFile(file: File){
        try {

            let resultUrl = await getUrlUpload(file.name, file.type)



            if(!resultUrl || !resultUrl.result || !resultUrl.result.uploadURL) throw new Error("Ocurrió un error al generar el enlace de subida de archivo.");
            let { id, extension, uploadURL } = resultUrl.result;



            let result = await fetch(resultUrl.result.uploadURL, {
                method: 'PUT',
                body: file,
                headers: {
                    'content-type': file.type
                },
            })



            let urlImage = `${Statics.instance.urlUploadAWS}${id}${extension}`

            if(!result || !result.ok) throw new Error("Ocurrió un error al generar el enlace del archivo subido.")

            return{error: false, mensaje: '', result: urlImage}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario. '+error }
        }
    }

    async getDeliveryLocation(){
        try {
            let url = Statics.instance.urlBase + Statics.instance.pedidoUrl + '/repartidores'

            await this.connection.buildHeaders()
            let result = await this.connection.get(url, true)

            console.log(result)

            return {error: false, mensaje: result.message, result: result.result}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener información de Usuario.' }
        }
    }

    async getLocations(locations:any[]){

    }

    async getCocinerosStatus(){
        try{

            let url = Statics.instance.urlBase + Statics.instance.pedidoUrl + '/statusCount'

            await this.connection.buildHeaders()
            let result = await this.connection.get(url, true)

            return {error: false, mensaje: ""+result.message, result: result.result}
        }catch(error){
            return { error: true, mensaje: 'Error al obtener cocineros por status. '+error }
        }
    }

    async deleteUser(UsuarioId:number){
        try{

            let url = Statics.instance.urlBase + Statics.instance.usersUrl + `/${UsuarioId}`;

            await this.connection.buildHeaders()
            let result = await this.connection.delete(url, true)

            return {error: false, mensaje: ""+result.message, result: result.result}
        }catch(error){
            return { error: true, mensaje: 'Error al eliminar el usuario. '+error }
        }
    }

}
