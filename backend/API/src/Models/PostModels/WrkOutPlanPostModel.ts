import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { Model } from '../Model.js';

@Table("WrkOutPlan")
export class WrkOutPlanPostModel extends Model {
    @Column({ type: "string", columnName: "PlanName" })
    public PlanName: string;
    @Column({ type: "number", columnName: "UserId" })
    public UserId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanName = jsonData.PlanName;
        this.UserId = jsonData.UserId;
    }
}
