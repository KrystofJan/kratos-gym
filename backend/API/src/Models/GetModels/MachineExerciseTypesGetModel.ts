import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class MachineExerciseTypeGetModel extends Model {
    public MachineId: number;
    public ExerciseTypeId: number;

    constructor(wrkOutMachineId: number, exerciseTypeId: number) {
        super();
        this.MachineId = wrkOutMachineId;
        this.ExerciseTypeId = exerciseTypeId;
    }
}
