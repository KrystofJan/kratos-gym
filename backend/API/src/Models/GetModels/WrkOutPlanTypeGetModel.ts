import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

@Table("WrkOutPlanType")
export class WrkOutPlanTypeGetModel extends Model implements GetModel {
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;
    @Column({ type: "number", columnName: "ExerciseTypeId" })
    public ExerciseTypeId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}
