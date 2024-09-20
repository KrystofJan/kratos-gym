import { IDictionary } from "../utils/Utilities.js";
import { Model } from './Model.js';
import { Account } from './Account.js';
import { Plan } from './Plan.js';
import { Column, ForeignKey, PrimaryKey, Table, getMetadataForProperties } from "./Decorators/DatabaseDecorators.js";

@Table("reservation")
@PrimaryKey("resetvation_id")

export class Reservation extends Model {
    @Column("resetvation_id")
    public ReservationId: number;

    @Column("amount_of_people")
    public AmountOfPeople: number;

    @Column("reservation_time")
    public ReservationTime: Date;

    @ForeignKey(Account)
    @Column("customer_id")
    public Customer: Account | null;

    @ForeignKey(Account)
    @Column("trainer_id")
    public Trainer: Account | null;

    @ForeignKey(Plan)
    @Column("plan_id")
    public Plan: Plan | null;

    constructor(jsonData: IDictionary<any>) {
        super();

        this.ReservationId = jsonData["reservation_id"] ?? jsonData["ReservationId"];
        this.AmountOfPeople = jsonData["amount_of_people"] ?? jsonData["AmoutOfPeople"];
        this.ReservationTime = jsonData["reservation_time"] ?? jsonData["ReservationTime"];
        this.Customer = jsonData["customer"] ?? jsonData["Customer"];
        this.Trainer = jsonData["Trainer"] ?? null;
        this.Plan = jsonData["Plan"] ?? null;
    }
}
