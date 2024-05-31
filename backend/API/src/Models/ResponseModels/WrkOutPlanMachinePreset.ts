import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { WrkOutMachine } from './WrkOutMachine.js';
import { WrkOutPlanPreset } from './WrkOutPlanPreset.js';

export class WrkOutPlanMachinePreset extends Model {
    @ForeignIdentifier("WrkOutPlanPresetId")
    public WrkOutPlanPreset: WrkOutPlanPreset;
    @ForeignIdentifier("WrkOutMachineId")
    public WrkOutMachine: WrkOutMachine;
    public Sets: number;
    public Reps: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanPreset = jsonData.WrkOutPlanPreset;
        this.WrkOutMachine = jsonData.WrkOutMachine;
        this.Sets = jsonData.Sets;
        this.Reps = jsonData.Reps;
    }
}
