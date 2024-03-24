import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class WrkOutPlanMachinePostModel extends Model {
    public WrkOutPlanId: number;
    public WrkOutMachineId: number;

    constructor(jsonData: IDictionary<number>){
        super();
        this.WrkOutMachineId = jsonData.WrkOutMachineId;
        this.WrkOutPlanId = jsonData.WrkOutPland;
    }
}
