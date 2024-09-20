import { Model } from '../Model.js';
export class WrkoutPlanMachineGetModel extends Model {
    constructor(jsonData) {
        super();
        this.wrkoutplanid = jsonData.wrkoutplanid;
        this.wrkoutmachineid = jsonData.wrkoutmachineid;
    }
}
