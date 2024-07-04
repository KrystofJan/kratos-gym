import { Column, Table } from "../Decorators/ReflectionDecorators.js"
import { IDictionary } from "../../utils/Utilities.js";
import { ForeignIdentifier, PrimaryIdentifier } from "../Decorators/IdentifierDecorator.js";
import { Model } from '../Model.js';
import { User } from './User.js';
import { WrkOutPlan } from './WrkOutPlan.js';

@Table("Reservation")
export class Reservation extends Model {

    @PrimaryIdentifier()
    @Column({ type: "number", columnName: "ReservationId" })
    public ReservationId: number;

    @Column({ type: "number", columnName: "AmmountOfPeople" })
    public AmmountOfPeople: number;

    @Column({ type: "date", columnName: "ReservationTime" })
    public ReservationTime: Date;

    @ForeignIdentifier("UserId")
    @Column({ type: "foreignObject", columnName: "Customer" })
    public Customer: User;

    @ForeignIdentifier("UserId")
    @Column({ type: "foreignObject", columnName: "Trainer" })
    public Trainer: User | null;

    @ForeignIdentifier("WrkOutPlan")
    @Column({ type: "foreignObject", columnName: "WrkOutPlan" })
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
