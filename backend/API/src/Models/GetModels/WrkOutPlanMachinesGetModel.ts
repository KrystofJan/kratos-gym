import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

export class WrkoutPlanMachineGetModel extends Model implements GetModel {
    public wrkoutplanid: number;
    public wrkoutmachineid: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.wrkoutplanid = jsonData.wrkoutplanid;
        this.wrkoutmachineid = jsonData.wrkoutmachineid;
    }
}
