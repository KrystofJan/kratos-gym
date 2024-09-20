import { Model } from '../Model.js';
export class PlanPostModel extends Model {
    constructor(jsonData) {
        super();
        this.plan_name = jsonData.PlanName;
        this.account_id = jsonData.AccountId;
    }
}
