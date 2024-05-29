import { BaseService } from './base/ApiService';


export class TestService extends BaseService{

    constructor(){
        super("test");
    }

    async getId (id) {
        const data = await this.baseGetId(id);
        return data[0];
    }
    
    async getAll () {
        const data = await this.baseGetAll();
        return data;
    }
    
    async post (body) {
        const data = await this.basePost(body);
        return data;
    }
} 
