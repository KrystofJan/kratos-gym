import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './User.js';
import { WrkOutMachine } from "./WrkOutMachine.js";
import { WrkOutPlan } from './WrkOutPlan.js';

export class WrkOutPlanMachine extends Model {
    public WrkOutPlanId: number;
    public WrkOutMachine: WrkOutMachine | null;
    public Sets: number;
    public Reps: number;
    public WrkOutStartTime: Date;
    public WrkOutEndTime: Date;
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
