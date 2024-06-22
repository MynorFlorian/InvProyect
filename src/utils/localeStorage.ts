// Libraries


// Utils
import { Statics } from "./statics";

// Interfaces
import { TokenData } from 'src/interfaces/objects/TokenData';
import { UserData } from 'src/interfaces/objects/UserData';

export class LocaleStorage {
    statics = new Statics();

    // * Welcome *
    welcomeRegisterId = 'welcome-register';
    async recordWelcome() {
        let record = await window.localStorage.getItem(this.welcomeRegisterId);
        if (!record) await window.localStorage.setItem(this.welcomeRegisterId, 'true');
    }

    async validateWelcome() {
        let record = await window.localStorage.getItem(this.welcomeRegisterId);
        return record ? true : false;
    }

    async enableWelcome() {
        await window.localStorage.removeItem(this.welcomeRegisterId);
    }

    // * Token *
    tokenId = 'token-data';
    async recordToken(data: TokenData) {
        await window.localStorage.setItem(this.tokenId, JSON.stringify(data));
    }

    async validateToken() {
        let record = await window.localStorage.getItem(this.tokenId);
        return record ? true : false;
    }

    async getToken() {
        let record = await window.localStorage.getItem(this.tokenId);
        let recordParsed: TokenData | undefined = record ? JSON.parse(record) : undefined;
        return recordParsed;
    }

    async removeToken() {
        let register = await this.getToken();
        if(register) await window.localStorage.removeItem(this.tokenId);
    }

    // * Token FMC *
    tokenFMCId = 'token-fmc';
    async recordTokenFmc(data:any){
        await window.localStorage.setItem(this.tokenFMCId, JSON.stringify({token: data}))
    }

    async getTokenFmc(){
        let tokenFmc:any = await window.localStorage.getItem(this.tokenFMCId)
        let record:any = tokenFmc ? JSON.parse(tokenFmc) : undefined
        return record
    }

    // * User *
    userId = 'user-data';
    async recordUser(data: UserData) {
        await window.localStorage.setItem(this.userId, JSON.stringify(data));
    }

    async validateUser() {
        let record = await window.localStorage.getItem(this.userId);
        return record ? true : false;
    }

    async getUser() {
        let record = await window.localStorage.getItem(this.userId);
        let recordParsed: UserData | undefined = record ? JSON.parse(record) : undefined;
        return recordParsed;
    }

    async removeUser() {
        let register = await this.getUser();
        if(register) await window.localStorage.removeItem(this.userId);
    }

}
