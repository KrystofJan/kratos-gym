import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Machine } from './Machine.js';
import { PlanPreset } from './PlanPreset.js';
export class PlanMachinePreset extends Model {

    PlanPreset: PlanPreset;
    Machine: Machine;
    Sets: number;
    Reps: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanPreset = jsonData.PlanPreset;
        this.Machine = jsonData.e;
        this.Sets = jsonData.Sets;
        this.Reps = jsonData.Reps;
    }
}
