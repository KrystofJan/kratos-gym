import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';

@Table("ExerciseType")
export class ExerciseType extends Model {

    @PrimaryIdentifier()
    @Column({ type: "number", columnName: "ExerciseTypeId" })
    public ExerciseTypeId: number | null;
    @Column({ type: "string", columnName: "ExerciseTypeName" })
    public ExerciseTypeName: string;
    @Column({ type: "string", columnName: "Category" })
    public Category: string;
    @Column({ type: "string", columnName: "BodyPart" })
    public BodyPart: string;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.ExerciseTypeId = jsonData.ExerciseTypeId
        this.ExerciseTypeName = jsonData.ExerciseTypeName;
        this.Category = jsonData.Category;
        this.BodyPart = jsonData.BodyPart;
    }
}
