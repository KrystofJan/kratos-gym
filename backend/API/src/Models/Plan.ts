import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './User.js';

export class Plan extends Model {
    public PlanId: number;
    public PlanName: string;
    public User: Account | null;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanId = jsonData.wrkoutplanid;
        this.PlanName = jsonData.planname;
        this.User = jsonData.account ?? null;
    }
}
