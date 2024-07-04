import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

@Table("WrkOutPlan")
export class WrkoutPlanGetModel extends Model implements GetModel {
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;
    @Column({ type: "string", columnName: "PlanName" })
    public PlanName: string;
    @Column({ type: "number", columnName: "UserId" })
    public UserId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.PlanName = jsonData.PlanName;
        this.UserId = jsonData.UserId;
    }
}
