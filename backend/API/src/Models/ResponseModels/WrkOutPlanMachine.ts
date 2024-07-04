import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { User } from './User.js';
import { WrkOutMachine } from "./WrkOutMachine.js";
import { WrkOutPlan } from './WrkOutPlan.js';

@Table("WrkOutPlanMachine")
export class WrkOutPlanMachine extends Model {

    @PrimaryIdentifier()
    @Column({ type: "number", columnName: "WrkOutPlanId" })
    public WrkOutPlanId: number;

    @ForeignIdentifier("WrkOutMachineId")
    @Column({ type: "foreignObject", columnName: "WrkOutMachine" })
    public WrkOutMachine: WrkOutMachine | null;

    @Column({ type: "number", columnName: "Sets" })
    public Sets: number;

    @Column({ type: "number", columnName: "Reps" })
    public Reps: number;

    @Column({ type: "date", columnName: "WrkOutStartTime" })
    public WrkOutStartTime: Date;

    @Column({ type: "date", columnName: "WrkOutEndTime" })
    public WrkOutEndTime: Date;

    @Column({ type: "boolean", columnName: "CanDisturb" })
    public CanDisturb: boolean;


    constructor(jsonData: IDictionary<any>) {
        super();
        this.WrkOutPlanId = jsonData.WrkOutPlanId;
        this.Sets = jsonData.sets;
        this.Reps = jsonData.reps;
        this.WrkOutStartTime = jsonData.WrkOutStartTime;
        this.WrkOutEndTime = jsonData.WrkOutEndTime;
        this.CanDisturb = jsonData.CanDisturb;
        this.WrkOutMachine = jsonData.WrkOutMachine ?? null;
    }
}
