import { Model } from '../Model.js';
export class MachineExerciseTypeGetModel extends Model {
    constructor(wrkOutMachineId, exerciseTypeId) {
        super();
        this.MachineId = wrkOutMachineId;
        this.ExerciseTypeId = exerciseTypeId;
    }
}
