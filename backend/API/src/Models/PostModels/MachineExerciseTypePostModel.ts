import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class MachineExerciseTypePostModel extends Model {
    public machine_id: number;
    public exercise_type_id: number;

    constructor(jsonData: IDictionary<number>) {
        super();
        this.machine_id = jsonData.MachineId;
        this.exercise_type_id = jsonData.ExerciseTypeId;
    }
}
