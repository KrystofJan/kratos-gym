import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { User } from './User.js';
import { WrkOutPlan } from './WrkOutPlan.js';

export class Reservation extends Model {

    @PrimaryIdentifier()
    public ReservationId: number;
    public AmmountOfPeople: number;
    public ReservationTime: Date;
    @ForeignIdentifier("UserId")
    public Customer: User;
    @ForeignIdentifier("UserId")
    public Trainer: User | null;
    @ForeignIdentifier("WrkOutPlan")
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
