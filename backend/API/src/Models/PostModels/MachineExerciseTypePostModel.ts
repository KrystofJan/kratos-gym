import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

@Table("MachineExerciseType")
export class MachineExerciseTypePostModel extends Model {
    @Column({ type: "number", columnName: "WrkOutMachineId" })
    public WrkOutMachineId: number;
    @Column({ type: "number", columnName: "ExerciseTypeId" })
    public ExerciseTypeId: number;

    constructor(jsonData: IDictionary<number>) {
        super();
        this.WrkOutMachineId = jsonData.WrkOutMachineId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}
