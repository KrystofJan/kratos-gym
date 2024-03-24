import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class MachineExerciseTypeGetModel extends Model {
    public WrkOutMachineId: number;
    public ExerciseTypeId: number;

    constructor(wrkOutMachineId: number, exerciseTypeId: number){
        super();
        this.WrkOutMachineId = wrkOutMachineId;
        this.ExerciseTypeId = exerciseTypeId;
    }
}
