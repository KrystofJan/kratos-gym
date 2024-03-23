import { IDictionary } from "../../utils/Utilities.js";
import { Model } from './Model.js';
import { User } from './User.js';
import { WrkOutMachine } from "./WrkOutMachine.js";
import { WrkOutPlan } from './WrkOutPlan.js';

export class WrkOutPlanMachine extends Model {
    public WrkOutPlan: WrkOutPlan;
    public WrkOutMachine: WrkOutMachine;
    public Sets: number;
    public Reps: number;
    public WrkOutStartTime: Date;
    public WrkOutEndTime: Date;
    public CanDisturb: boolean;


    constructor(jsonData: IDictionary<any>){
        super();
        this.WrkOutPlan = jsonData.WrkOutPlan;
        this.WrkOutMachine = jsonData.WrkOutMachine;
        this.Sets = jsonData.Sets;
        this.Reps = jsonData.Reps;
        this.WrkOutStartTime = jsonData.WrkOutStartTime;
        this.WrkOutEndTime = jsonData.WrkOutEndTime;
        this.CanDisturb = jsonData.CanDisturb;
    }
}
