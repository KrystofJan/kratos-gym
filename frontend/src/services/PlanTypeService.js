import { BaseService } from './base/ApiService';
import * as config from '@/services/config/api_config';


export class PlanTypeService extends BaseService {
    constructor(){
        super('types', 'plan');
    }

    async post(body, planId){
        try {
            const requestOptions = config.post_headers;
            requestOptions.body = JSON.stringify(body);
            const response = await fetch(`${config.url}/plan/${planId}/addType`, requestOptions);
            return response;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
} 
