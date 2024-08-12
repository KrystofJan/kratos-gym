import { Model } from '../Model.js';
export class OccupiedMachinesGetModel extends Model {
    constructor(body) {
        super();
        this.count = body.count;
    }
}
