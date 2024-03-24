import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { ExerciseType } from './ExerciseType.js';
import { WrkOutMachine } from './WrkOutMachine.js';

export class MachineExerciseTypes extends Model{
    public ExerciseType: ExerciseType;
    public Machine: WrkOutMachine;

    constructor(jsonData: IDictionary<any>){
        super();
        this.ExerciseType = jsonData.ExerciseType;
        this.Machine = jsonData.WrkOutMachine;
    }
}
