import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

export class WrkoutPlanGetModel extends Model implements GetModel {
    public wrkoutplanid: number;
    public planname: string;
    public accountid: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.wrkoutplanid = jsonData.wrkoutplanid;
        this.planname = jsonData.planname;
        this.accountid = jsonData.accountid;
    }
}
