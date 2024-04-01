import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { User } from './User.js';

export class WrkOutPlanPreset extends Model{
    WrkOutPlanPresetId: number;
    PresetName: string;
    Author: User;

    constructor(jsonData: IDictionary<any>){
        super();
        this.WrkOutPlanPresetId = jsonData.WrkOutPlanPresetId;
        this.PresetName = jsonData.PresetName;
        this.Author = jsonData.User;
    }
}
