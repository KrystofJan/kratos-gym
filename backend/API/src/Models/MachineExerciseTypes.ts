import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { ExerciseType } from './ExerciseType.js';
import { Machine } from './Machine.js';
import { Column, ForeignKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("machine_exercise_type")
export class MachineExerciseTypes extends Model {
    @ForeignKey(ExerciseType)
    @Column("exercise_type_id")
    public ExerciseType: ExerciseType;

    @ForeignKey(Machine)
    @Column("machine_id")
    public Machine: Machine;

    constructor(jsonData: IDictionary<any>) {
        super();
        const databaseNames = getMetadataForProperties(MachineExerciseTypes);
        this.ExerciseType = jsonData[databaseNames["ExerciseType"]];
        this.Machine = jsonData[databaseNames["Machine"]];
    }
}
