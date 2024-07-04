import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { Model } from '../Model.js';

@Table("MachineExerciseType")
export class MachineExerciseTypeGetModel extends Model {
    @Column({ type: "number", columnName: "WrkOutMachineId" })
    public WrkOutMachineId: number;
    @Column({ type: "number", columnName: "ExerciseTypeId" })
    public ExerciseTypeId: number;

    constructor(wrkOutMachineId: number, exerciseTypeId: number) {
        super();
        this.WrkOutMachineId = wrkOutMachineId;
        this.ExerciseTypeId = exerciseTypeId;
    }
}
