import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

export class WrkOutPlanTypeGetModel extends Model implements  GetModel{
    public WrkOutPlanId: number;
    public ExerciseTypeId: number;
    
    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}