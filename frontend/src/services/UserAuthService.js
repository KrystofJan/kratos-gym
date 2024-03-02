import { BaseService } from './base/ApiService';

export class UserAuthService {
    async logIn (body) {
        try {
            const data = await new BaseService().getId(body, "userauth/login");
            return data[0];
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async register (body) {
        try {
            const data = await new BaseService().getAll("userauth/register",body);
            return data;
        } catch (error) {
            console.error('Error posting data:', error);
        }
    }
}
