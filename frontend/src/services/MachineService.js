import { BaseService } from './base/ApiService';

export class MachineService extends BaseService {
    constructor() {
        super('machine');
    }

    async getMachineById(id) {
        const data = await this.baseGetId(id);
        return data;
    }

    async getAll() {
        const data = await this.baseGetAll();
        return data;
    }

} 
