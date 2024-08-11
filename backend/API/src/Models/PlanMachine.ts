import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './User.js';
import { Machine } from "./Machine.js";

export class PlanMachine extends Model {
    public PlanId: number;
    public Machine: Machine | null;
    public Sets: number;
    public Reps: number;
    public StartTime: Date;
    public EndTime: Date;
    public CanDisturb: boolean;


    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanId = jsonData.PlanId;
        this.Sets = jsonData.sets;
        this.Reps = jsonData.reps;
        this.StartTime = jsonData.StartTime;
        this.EndTime = jsonData.EndTime;
        this.CanDisturb = jsonData.CanDisturb;
        this.Machine = jsonData.Machine ?? null;
    }
}
