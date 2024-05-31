import { IDictionary } from "../../utils/Utilities.js";
import { ExerciseType } from "./ExerciseType.js";
import { Model } from '../Model.js';
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";

export class WrkOutPlanType extends Model {

    @PrimaryIdentifier()
    public WrkOutPlanId: number;
    @ForeignIdentifier("ExerciseTypeId")
    public ExerciseType: ExerciseType;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.ExerciseType = jsonData.ExerciseType;
    }
}
