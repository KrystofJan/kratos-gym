import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { Model } from '../Model.js';

@Table("WrkOutPlanType")
export class WrkOutPlanTypePostModel extends Model {

    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;

    @Column({ type: "number", columnName: "ExerciseTypeId" })
    public ExerciseTypeId: number;

    constructor(jsonData: IDictionary<number>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.ExerciseTypeId = jsonData.ExerciseTypeId;
    }
}
