import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { ExerciseType } from './ExerciseType.js';
import { WrkOutMachine } from './WrkOutMachine.js';

@Table("MachineExerciseTypes")
export class MachineExerciseTypes extends Model {

    @ForeignIdentifier("ExerciseTypeId")
    @Column({ type: "foreignObject", columnName: "ExerciseType" })
    public ExerciseType: ExerciseType;
    @ForeignIdentifier("WrkOutMachineId")
    @Column({ type: "foreignObject", columnName: "Machine" })
    public Machine: WrkOutMachine;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.ExerciseType = jsonData.ExerciseType;
        this.Machine = jsonData.Machine;
    }
}
