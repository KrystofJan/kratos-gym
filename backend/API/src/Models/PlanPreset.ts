import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './Account.js';
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("plan_preset")
@PrimaryKey("plan_preset_id")
export class PlanPreset extends Model {
    @Column("plan_preset_id")
    PlanPresetId: number;

    @Column("preset_name")
    PresetName: string;

    @ForeignKey(Account)
    @Column("author_id")
    Author: Account;

    constructor(jsonData: IDictionary<any>) {
        super();
        const databaseNames = getMetadataForProperties(PlanPreset);
        this.PlanPresetId = jsonData[databaseNames["PlanPresetId"]];
        this.PresetName = jsonData[databaseNames["PresetName"]];
        this.Author = jsonData[databaseNames["Author"]];
    }
}
