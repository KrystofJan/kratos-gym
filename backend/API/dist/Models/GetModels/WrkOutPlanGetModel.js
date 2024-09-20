import { Model } from '../Model.js';
export class WrkoutPlanGetModel extends Model {
    constructor(jsonData) {
        super();
        this.wrkoutplanid = jsonData.wrkoutplanid;
        this.planname = jsonData.planname;
        this.accountid = jsonData.accountid;
    }
}
