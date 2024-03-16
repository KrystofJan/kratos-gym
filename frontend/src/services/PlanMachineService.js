import { BaseService } from './base/ApiService';
import * as config from '@/services/config/api_config';


export class PlanMachineService extends BaseService {
    constructor(){
        super('plan-machine');
    }

    /**
     * 
     * @param {Number} id 
     * @param {String} time 
     * @param {Date} date 
     */
    async isMachineOccupied(id, time, date){
        try {
            const result = await fetch(`${config.url}/${this.endpoint}/${id}?time=${time}&date=${date}`);
            const plans = await result.json();
            
            return (plans.amount > 0);
        }
        catch(err) {
            console.error(err);
        }
    }
} 
