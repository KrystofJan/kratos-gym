import { BaseService } from './base/ApiService';

export class ReservationService extends BaseService{
    
    constructor(){
        super("reservation");
    }
    
    async getId (id) {
        const data = await this.baseGetId(id);
        return data[0];
    }

    async getAll () {
        try {
            const data = await this.getAll();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    async post(body){
        const data = await this.basePost(body);
        return data;
    }
}
