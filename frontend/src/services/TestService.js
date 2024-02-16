import { BaseService } from './base/ApiService';


export class TestService {
    async getId (id) {
        try {
            const data = await new BaseService().getId(id, "test");
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async getAll () {
        try {
            const data = await new BaseService().getAll("test");
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async post (body) {
        try {
            const data = await new BaseService().post("test", body);
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
} 
