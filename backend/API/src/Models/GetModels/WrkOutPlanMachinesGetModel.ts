import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from '../../utils/Utilities.js';
import { GetModel } from './GetModel.js'
import { Model } from '../Model.js';

@Table("WrkOutPlanMachine")
export class WrkoutPlanMachineGetModel extends Model implements GetModel {
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;
    @Column({ type: "number", columnName: "WrkOutMachineId" })
    public WrkOutMachineId: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.WrkOutMachineId = jsonData.WrkOutMachineId;
    }
}
