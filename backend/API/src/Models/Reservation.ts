import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './User.js';
import { WrkOutPlan } from './WrkOutPlan.js';

export class Reservation extends Model {
    public ReservationId: number;
    public AmmountOfPeople: number;
    public ReservationTime: Date;
    public Customer: Account;
    public Trainer: Account | null;
    public WrkOutPlan: WrkOutPlan;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.ReservationId = jsonData.ReservetionId;
        this.AmmountOfPeople = jsonData.AmmoutOfPeople;
        this.ReservationTime = jsonData.ReservationTime;
        this.Customer = jsonData.Customer;
        this.Trainer = jsonData.Trainer ?? null;
        this.WrkOutPlan = jsonData.WrkOutPlan;
    }
}
