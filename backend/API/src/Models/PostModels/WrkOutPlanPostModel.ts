import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js';

export class WrkOutPlanPostModel extends Model {
    public planname: string;
    public accountid: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.planname = jsonData.PlanName;
        this.accountid = jsonData.AccountId;
    }
}
