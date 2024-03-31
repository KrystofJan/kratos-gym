import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

export class WrkoutPlanGetModel extends Model implements  GetModel{
    public WrkOutPlanId: number;
    public PlanName: string;
    public UserId: number;
    
    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.PlanName = jsonData.PlanName;
        this.UserId = jsonData.UserId;
    }
}