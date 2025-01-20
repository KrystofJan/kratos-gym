import { Account } from "./account";
import { Plan, PlanPost } from "./plan"

export interface Reservation {
    ReservationId: number;
    AmountOfPeople: number;
    ReservationTime: Date;
    Customer: Account | undefined;
    Trainer: Account | undefined;
    Plan: Plan | undefined;
}

export interface ReservationPost {
    AmountOfPeople: number;
    ReservationTime: Date;
    CustomerId: number;
    TrainerId?: number;
    Plan: Partial<PlanPost>;
}
