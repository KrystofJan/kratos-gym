import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class MachineExerciseTypePostModel extends Model {
    public WrkOutMachineId: number;
    public ExerciseTypeId: number;

    constructor(jsonData: IDictionary<number>){
        super();
        this.WrkOutMachineId = jsonData.WrkOutMachineId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}
