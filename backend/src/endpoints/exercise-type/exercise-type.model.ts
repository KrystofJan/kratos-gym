import { IDictionary } from "../../utils"
import { Model } from '../Model'
import {
    Column,
    PrimaryKey,
    Table,
} from "../../database";

@Table("exercise_type")
@PrimaryKey("exercise_type_id")
export class ExerciseType extends Model {
    @Column("exercise_type_id")
    public ExerciseTypeId: number | null;

    @Column("type_name")
    public TypeName: string;

    @Column("category")
    public Category: string;

    @Column("body_part")
    public BodyPart: string;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.ExerciseTypeId = jsonData["ExerciseTypeId"] ?? jsonData["exercise_type_id"]
        this.TypeName = jsonData["TypeName"] ?? jsonData["type_name"]
        this.Category = jsonData["Category"] ?? jsonData["category"]
        this.BodyPart = jsonData["BodyPart"] ?? jsonData["body_part"]
    }
}
