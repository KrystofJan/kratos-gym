import { IDictionary } from '../../utils';
import { Account } from '../account/account.model';
import { Model } from '../Model';
import { Column, ForeignKey, PrimaryKey, Table } from "../../database";
import { UnInsertable } from '../../database/decorators/database-decorators';

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
    public Customer: Account;

    @ForeignKey(Account)
    @Column("trainer_id")
    public Trainer: Account;

    @ForeignKey(Plan)
    @Column("plan_id")
    public Plan: Plan;

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
