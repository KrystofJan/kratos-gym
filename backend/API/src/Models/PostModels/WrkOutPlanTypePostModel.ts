import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

export class WrkOutPlanTypePostModel extends Model{
    WrkOutPlanId: number;
    ExerciseTypeId: number;

    constructor(jsonData: IDictionary<number>){
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}
