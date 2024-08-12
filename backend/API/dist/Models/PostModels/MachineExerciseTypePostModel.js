import { Model } from '../Model.js';
export class MachineExerciseTypePostModel extends Model {
    constructor(jsonData) {
        super();
        this.machine_id = jsonData.MachineId;
        this.exercise_type_id = jsonData.ExerciseTypeId;
    }
}
