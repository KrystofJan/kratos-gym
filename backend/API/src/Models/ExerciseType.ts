import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Column, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("exercise_type")
@PrimaryKey("exercise_type_id")

export class ExerciseType extends Model {
    @Column("exercise_type_id")
    public ExerciseTypeId: number | null;
    @Column("exercise_type_name")
    public ExerciseTypeName: string;
    @Column("category")
    public Category: string;
    @Column("body_part")
    public BodyPart: string;

    constructor(jsonData: IDictionary<any>) {
        super();

        const databaseNames = getMetadataForProperties(ExerciseType);
        this.ExerciseTypeId = jsonData[databaseNames["City"]];
        this.ExerciseTypeName = jsonData[databaseNames["ExerciseTypeName"]];
        this.Category = jsonData[databaseNames["Category"]];
        this.BodyPart = jsonData[databaseNames["BodyPart"]];
    }
}
