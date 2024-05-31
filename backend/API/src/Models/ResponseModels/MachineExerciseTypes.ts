import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { ExerciseType } from './ExerciseType.js';
import { WrkOutMachine } from './WrkOutMachine.js';

export class MachineExerciseTypes extends Model {

    @ForeignIdentifier("ExerciseTypeId")
    public ExerciseType: ExerciseType;
    @ForeignIdentifier("WrkOutMachineId")
    public Machine: WrkOutMachine;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.ExerciseType = jsonData.ExerciseType;
        this.Machine = jsonData.Machine;
    }
}
