import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { WrkOutMachine } from './WrkOutMachine.js';
import { WrkOutPlanPreset } from './WrkOutPlanPreset.js';

@Table("WrkOutPlanMachinePreset")
export class WrkOutPlanMachinePreset extends Model {

    @ForeignIdentifier("WrkOutPlanPresetId")
    @Column({ type: "foreignObject", columnName: "WrkOutPlanPreset" })
    public WrkOutPlanPreset: WrkOutPlanPreset;

    @ForeignIdentifier("WrkOutMachineId")
    @Column({ type: "foreignObject", columnName: "WrkOutMachine" })
    public WrkOutMachine: WrkOutMachine;

    @Column({ type: "number", columnName: "Sets" })
    public Sets: number;

    @Column({ type: "number", columnName: "Reps" })
    public Reps: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanPreset = jsonData.WrkOutPlanPreset;
        this.WrkOutMachine = jsonData.WrkOutMachine;
        this.Sets = jsonData.Sets;
        this.Reps = jsonData.Reps;
    }
}
