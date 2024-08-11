import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { ExerciseType } from './ExerciseType.js';
import { Machine } from './Machine.js';

export class MachineExerciseTypes extends Model {
    public ExerciseType: ExerciseType;
    public Machine: Machine;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.ExerciseType = jsonData.ExerciseType;
        this.Machine = jsonData.Machine;
    }
}
