import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { ExerciseType } from "./ExerciseType.js";
import { Model } from '../Model.js';
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";

@Table("WrkOutPlanType")
export class WrkOutPlanType extends Model {

    @PrimaryIdentifier()
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;

    @ForeignIdentifier("ExerciseTypeId")
    @Column({ type: "foreignObject", columnName: "ExerciseType" })
    public ExerciseType: ExerciseType;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.ExerciseType = jsonData.ExerciseType;
    }
}
