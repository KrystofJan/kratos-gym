import { IDictionary } from "../../utils/Utilities.js";
import { ExerciseType } from "./ExerciseType.js";
import { Model } from './Model.js';

export class WrkOutPlan extends Model{
    WrkOutPlan: WrkOutPlan;
    ExerciseType: ExerciseType;


    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlan = jsonData.WrkOutPlan;
        this.ExerciseType = jsonData.ExerciseType;
    }
}
