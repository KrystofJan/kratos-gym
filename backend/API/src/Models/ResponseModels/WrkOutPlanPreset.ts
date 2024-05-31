import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { User } from './User.js';

export class WrkOutPlanPreset extends Model {

    @PrimaryIdentifier()
    public WrkOutPlanPresetId: number;
    public PresetName: string;
    @ForeignIdentifier("UserId")
    public Author: User;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanPresetId = jsonData.WrkOutPlanPresetId;
        this.PresetName = jsonData.PresetName;
        this.Author = jsonData.User;
    }
}
