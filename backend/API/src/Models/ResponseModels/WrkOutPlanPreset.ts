import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { User } from './User.js';

@Table("WrkOutPlanPreset")
export class WrkOutPlanPreset extends Model {

    @PrimaryIdentifier()
    @Column({ type: "number", columnName: "WrkOutPlanPresetId" })
    public WrkOutPlanPresetId: number;

    @Column({ type: "string", columnName: "PresetName" })
    public PresetName: string;

    @ForeignIdentifier("UserId")
    @Column({ type: "foreignObject", columnName: "Author" })
    public Author: User;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanPresetId = jsonData.WrkOutPlanPresetId;
        this.PresetName = jsonData.PresetName;
        this.Author = jsonData.User;
    }
}
