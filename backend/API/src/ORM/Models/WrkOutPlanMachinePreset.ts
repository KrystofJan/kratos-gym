import { IDictionary } from "../../utils/Utilities.js";
import { Model } from './Model.js';
import { WrkOutMachine } from './WrkOutMachine.js';
import { WrkOutPlanPreset } from './WrkOutPlanPreset.js';
export class WrkOutPlanMachinePreset extends Model{

    WrkOutPlanPreset: WrkOutPlanPreset;
    WrkOutMachine: WrkOutMachine;
    Sets: number;
    Reps: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanPreset = jsonData.WrkOutPlanPreset;
        this.WrkOutMachine = jsonData.WrkOutMachine;
        this.Sets = jsonData.Sets;
        this.Reps = jsonData.Reps;
    }
}
