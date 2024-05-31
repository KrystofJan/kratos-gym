import { IDictionary } from "../../utils/Utilities.js";
import { PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';

export class ExerciseType extends Model {

    @PrimaryIdentifier()
    public ExerciseTypeId: number | null;
    public ExerciseTypeName: string;
    public Category: string;
    public BodyPart: string;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.ExerciseTypeId = jsonData.ExerciseTypeId
        this.ExerciseTypeName = jsonData.ExerciseTypeName;
        this.Category = jsonData.Category;
        this.BodyPart = jsonData.BodyPart;
    }
}
