import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './Account.js';
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("plan")
@PrimaryKey("plan_id")

export class Plan extends Model {
    @Column("plan_id")
    public PlanId: number;

    @Column("plan_name")
    public PlanName: string;

    @ForeignKey(Account)
    @Column("account_id")
    public User: Account | null;

    constructor(jsonData: IDictionary<any>) {
        super();
        this.PlanId = jsonData["plan_id"] ?? jsonData["PlanId"];
        this.PlanName = jsonData["plan_name"] ?? jsonData["PlanName"];
        if (jsonData["Account"]) {

            this.User = jsonData["Account"];
        } else {
            this.User = new Account(jsonData)
        }
    }
}
