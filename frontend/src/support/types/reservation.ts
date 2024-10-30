import { Account } from "./account";
import { Plan } from "./plan"
export interface Reservation {
    ReservationId: number;
    AmountOfPeople: number;
    ReservationTime: Date;
    Customer: Account | undefined;
    Trainer: Account | undefined;
    Plan: Plan | undefined;
}

