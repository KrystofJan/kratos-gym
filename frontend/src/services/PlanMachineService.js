import { BaseService } from './base/ApiService';
import * as config from '@/services/config/api_config';

export class PlanMachineService extends BaseService {
    constructor() {
        super('machines', 'plan');
    }

    /**
     * 
     * @param {Number} id 
     * @param {String} time 
     * @param {Date} date 
     */
    async isMachineOccupied(id, time, date) {
        try {
            const result = await
                fetch(`${config.url}/${this.supportEndpoint}/${id}/${this.endpoint}?time=${time}&date=${date}`);
            const plans = await result.json();

            return (plans.amount > 0);
        }
        catch (err) {
            console.error(err);
        }
    }

    async post(body, planId) {
        try {
            const requestOptions = config.post_headers;
            requestOptions.body = JSON.stringify(body);
            const response = await fetch(`${config.url}/plan/${planId}/addMachine`, requestOptions);
            return response;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

} 
