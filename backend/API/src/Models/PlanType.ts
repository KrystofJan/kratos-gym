import { IDictionary } from "../utils/Utilities.js";
import { ExerciseType } from "./ExerciseType.js";
import { Model } from './Model.js';
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("address")
@PrimaryKey("plan_id")

export class PlanType extends Model {
    @Column("plan_id")
    PlanId: number;

    @ForeignKey(ExerciseType)
    @Column("exercise_type_id")
    ExerciseType: ExerciseType;

    constructor(jsonData: IDictionary<any>) {
        super();
        const databaseNames = getMetadataForProperties(PlanType);
        this.PlanId = jsonData[databaseNames["PlanId"]];
        this.ExerciseType = jsonData[databaseNames["ExerciseType"]];
    }
}
