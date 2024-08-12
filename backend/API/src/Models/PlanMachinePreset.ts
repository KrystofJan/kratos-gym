import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Machine } from './Machine.js';
import { PlanPreset } from './PlanPreset.js';
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

@Table("plan_machine_prest")
export class PlanMachinePreset extends Model {

    @ForeignKey(PlanPreset)
    @Column("plan_preset_id")
    PlanPreset: PlanPreset;

    @ForeignKey(Machine)
    @Column("machine_id")
    Machine: Machine;

    @Column("sets")
    Sets: number;

    @Column("reps")
    Reps: number;

    constructor(jsonData: IDictionary<any>) {
        super();
        const databaseNames = getMetadataForProperties(PlanMachinePreset);
        this.PlanPreset = jsonData[databaseNames["PlanPreset"]];
        this.Machine = jsonData[databaseNames["Machine"]];
        this.Sets = jsonData[databaseNames["Sets"]];
        this.Reps = jsonData[databaseNames["Reps"]];
    }
}
