import http from 'src/utils/http';
import { Statics } from 'src/utils/statics';
import { LocaleStorage } from 'src/utils/localeStorage';
import { LogStatusUsuarioData } from '../interfaces/objects/LogStatusUsuarioData';



export class LogStatusUsuarioService{
    storage = new LocaleStorage()
    connection = new http()

    async getAll(id:number, query:string){
        try {
            
            let url = Statics.instance.urlBase + Statics.instance.logStatusUrl + '/'+query

            await this.connection.buildHeaders()

            let result = await this.connection.get(url,true)

            return{error: result.error, mensaje: result.message, result: result.result, count: result.count}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener direcciones: '+error }
        }
    }

    async getLogStatusUsuario(id:number){
        try {
            let url = Statics.instance.urlBase + Statics.instance.logStatusUrl + '/'+id

            await this.connection.buildHeaders()

            let result = await this.connection.get(url, true)

            return{error: result.error, mensaje: result.message, result: result.result}
        } catch (error) {
            return { error: true, mensaje: 'Error al obtener direccion: '+error }
        }
    }

    async updateLogStatusUsuario(id:number, values:any){
        try {
            let url = Statics.instance.urlBase + Statics.instance.logStatusUrl + '/'+id

            await this.connection.buildHeaders()
            
            let data = values

            let result = await this.connection.put(url, data, true)

            return{error: result.error, mensaje: result.message, result: true}            
        } catch (error) {
            return { error: true, mensaje: 'Error al editar direccion: '+error }
        }
    }

    async createLogStatusUsuario(data:LogStatusUsuarioData){
        try {
            let url = Statics.instance.urlBase + Statics.instance.logStatusUrl + '/'
            
            await this.connection.buildHeaders()

            let result = await this.connection.post(url, data, true)


            return{error: result.error, mensaje: result.message, result: true}
        } catch (error) {
            return { error: true, mensaje: 'Error al crear direccion: '+error }            
        }
    }

    async deleteLogStatusUsuario(id:number){
        try {
            let url = Statics.instance.urlBase + Statics.instance.logStatusUrl + '/'+id

            await this.connection.buildHeaders()

            let result = await this.connection.delete(url, true)

            return{error: result.error, mensaje: result.message, result: true}
        } catch (error) {
            return { error: true, mensaje: 'Error al eliminar direccion: '+error }
        }
    }
}