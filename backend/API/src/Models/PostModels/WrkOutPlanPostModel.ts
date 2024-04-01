import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js';

export class WrkOutPlanPostModel extends Model{
    public PlanName: string;
    public UserId: number;
    
    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanName = jsonData.PlanName;
        this.UserId = jsonData.UserId;
    }
}
