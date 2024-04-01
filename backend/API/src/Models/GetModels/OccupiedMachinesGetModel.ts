import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class OccupiedMachinesGetModel extends Model {
    public count: number;

    constructor(body: IDictionary<number>){
        super();
        this.count = body.count; 
    }
}
