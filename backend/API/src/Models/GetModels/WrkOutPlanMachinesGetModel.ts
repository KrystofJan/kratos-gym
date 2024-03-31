import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

export class WrkoutPlanMachineGetModel extends Model implements  GetModel{
    public WrkOutPlanId: number;
    public WrkOutMachineId: number;
    
    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.WrkOutMachineId = jsonData.WrkOutMachineId;
    }
}