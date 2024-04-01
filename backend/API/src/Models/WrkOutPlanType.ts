import { IDictionary } from "../utils/Utilities.js";
import { ExerciseType } from "./ExerciseType.js";
import { Model } from './Model.js';

export class WrkOutPlanType extends Model{
    WrkOutPlanId: number;
    ExerciseType: ExerciseType;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.ExerciseType = jsonData.ExerciseType;
    }
}
