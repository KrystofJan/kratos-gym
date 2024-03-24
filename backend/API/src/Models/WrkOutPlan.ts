import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { User } from './User.js';

export class WrkOutPlan extends Model{
    public WrkOutPlanId: number;
    public PlanName: string;
    public User: User | null;
    
    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.PlanName = jsonData.PlanName;
        this.User = jsonData.User;
    }
}
