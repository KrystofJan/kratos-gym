import { BaseService } from './base/ApiService';

export class PlanService extends BaseService {
    constructor(){
        super('plan');
    }

    async post(body){
        const data = await this.basePost(body);
        return data;
    }
    
} 
