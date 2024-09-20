import { Model } from '../Model.js';
export class PlanTypePostModel extends Model {
    constructor(jsonData) {
        super();
        this.plan_id = jsonData.PlanId;
        this.exercise_type_id = jsonData.ExerciseTypeId;
    }
}
