import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js';

export class PlanPostModel extends Model {
    public plan_name: string;
    public account_id: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.plan_name = jsonData.PlanName;
        this.account_id = jsonData.AccountId;
    }
}
