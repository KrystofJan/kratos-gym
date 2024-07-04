import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { User } from './User.js';

@Table("WrkOutPlan")
export class WrkOutPlan extends Model {

    @PrimaryIdentifier()
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;

    @Column({ type: "string", columnName: "PlanName" })
    public PlanName: string;

    @ForeignIdentifier("UserId")
    @Column({ type: "foreignObject", columnName: "User" })
    public User: User | null;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.PlanName = jsonData.PlanName;
        this.User = jsonData.User;
    }
}
