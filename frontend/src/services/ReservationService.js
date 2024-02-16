import { BaseService } from './base/ApiService';

export class ReservationService {
    async getId (id) {
        try {
            const data = await new BaseService().getId(id, "reservation");
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async getAll () {
        try {
            const data = await new BaseService().getAll("reservation");
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}
