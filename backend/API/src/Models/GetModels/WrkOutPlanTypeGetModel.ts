import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

export class PlanTypeGetModel extends Model implements GetModel {
    public PlanId: number;
    public ExerciseTypeId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanId = jsonData.PlanId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}
