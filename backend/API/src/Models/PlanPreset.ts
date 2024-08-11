import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './User.js';

export class PlanPreset extends Model {
    PlanPresetId: number;
    PresetName: string;
    Author: Account;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanPresetId = jsonData.PlanPresetId;
        this.PresetName = jsonData.PresetName;
        this.Author = jsonData.User;
    }
}
