import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class PlanTypePostModel extends Model {
    public plan_id: number;
    public exercise_type_id: number;

    constructor(jsonData: IDictionary<number>) {
        super();
        this.plan_id = jsonData.PlanId;
        this.exercise_type_id = jsonData.ExerciseTypeId;
    }
}
