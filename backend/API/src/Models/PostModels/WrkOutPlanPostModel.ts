import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js';

export class WrkOutPlanPostModel extends Model{
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
