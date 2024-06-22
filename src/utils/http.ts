import { Statics } from "./statics";
const btoa = require('Base64').btoa;

// ** Config
import authConfig from 'src/configs/auth'
export default class http {

    GETheaders: any = {};
    POSTheaders: any = {};
    DELETEheaders: any = {};
    TOKENheaders: any = {};
    TOKENheadersPost: any = {};

    constructor() {
    }

    get = async (url: string, token: boolean = false) => {
        try {
            let headers = this.GETheaders;
            if (token) headers = this.TOKENheaders;
            let req = await fetch(url, {
                method: "GET",
                headers: headers,
            });
            let json = await req.json();
            return json;
        } catch (error: any) {
            console.log("http get method err", error);
            throw new Error(error);
        }
    }

    post = async (url: string, body: any, token: boolean = false) => {
        try {

            let headers = this.POSTheaders;
            if (token) headers = this.TOKENheadersPost;

            let req = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body), // data can be `string` or {object}!
                headers: headers
            });

            let json = await req.json();
            return json;
        } catch (error: any) {
            console.log("http post method err", error);
            throw new Error(error);
        }
    }

    upload = async (url: string, body: any, token: boolean = false) => {
        try {

            let headers = this.POSTheaders;
            if (token) headers = this.TOKENheadersPost;

            let req = await fetch(url, {
                    headers: { 'Authorization': headers['Authorization']},
                    method: 'POST',
                    body
                });

            let json = await req.json();
            return json;
        } catch (error: any) {
            console.log("http post method err", error);
            throw new Error(error);
        }
    }

    download = async (url: string, body: any, token: boolean = false) => {
        try {

            let headers = this.POSTheaders;
            if (token) headers = this.TOKENheadersPost;

            let req = await fetch(url, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify(body)
                });

            let blob = await req.blob();

            return blob;

        } catch (error: any) {
            console.log("http download method err", error);
            throw new Error(error);
        }
    }


    put = async (url: string, body: any, token: boolean = false) => {
        try {
            let headers = this.POSTheaders;
            if (token) headers = this.TOKENheadersPost;

            let req = await fetch(url, {
                method: "PUT",
                body: JSON.stringify(body), // data can be `string` or {object}!
                headers: headers
            });

            let json = await req.json();
            return json;

        } catch (error: any) {
            console.log("http post method err", error);
            throw new Error(error);
        }
    }

    delete = async (url: string, token: boolean = false) => {
        try {
            let headers = this.DELETEheaders;
            if (token) headers = this.TOKENheadersPost;

            let req = await fetch(url, {
                method: "DELETE",
                headers: headers
            });

            let json = await req.json();
            return json;

        } catch (error: any) {
            console.log("http post method err", error);
            throw new Error(error);
        }
    }

    async buildHeaders() {
        // Headers de auth con token
        if (typeof window !== undefined) {
            let token: any = window.localStorage.getItem(authConfig.storageTokenKeyName);
            if(token){
                this.TOKENheaders = { 'Authorization': `Bearer ${token}`};
                this.TOKENheadersPost = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
            }
        }

        // Headers de auth basica
        this.GETheaders = {'Authorization': 'Basic ' + btoa(Statics.instance.readCredentials.user + ":" + Statics.instance.readCredentials.pass)};
        this.DELETEheaders = {'Authorization': 'Basic ' + btoa(Statics.instance.deleteCredentials.user + ":" + Statics.instance.deleteCredentials.pass)};
        this.POSTheaders = {
            'Authorization': 'Basic ' + btoa(Statics.instance.writeCredentials.user + ":" + Statics.instance.writeCredentials.pass),
            'Content-Type': 'application/json'
        };
    }
}
