import { IDictionary } from "../../utils/Utilities.js";
import { Model } from './Model.js';

export class ExerciseType extends Model{
    public ExerciseTypeId: number | null;
    public ExerciseTypeName: string;
    public Category: string;
    public BodyPart: string;

    constructor(jsonData: IDictionary<any>){
        super();
        this.ExerciseTypeId = jsonData.ExerciseTypeId
        this.ExerciseTypeName = jsonData.ExerciseTypeName;
        this.Category = jsonData.Category;
        this.BodyPart = jsonData.BodyPart;
    }
}
