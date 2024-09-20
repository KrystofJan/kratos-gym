import { Model } from '../Model.js';
export class PlanTypeGetModel extends Model {
    constructor(jsonData) {
        super();
        this.PlanId = jsonData.PlanId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}
