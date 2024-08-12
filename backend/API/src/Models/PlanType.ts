import { IDictionary } from "../utils/Utilities.js";
import { ExerciseType } from "./ExerciseType.js";
import { Model } from './Model.js';

export class PlanType extends Model {
    PlanId: number;
    ExerciseType: ExerciseType;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanId = jsonData.PlanId;
        this.ExerciseType = jsonData.ExerciseType;
    }
}
