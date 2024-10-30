import { Express } from "express";
import { AddressRouter } from "../endpoints/address/address.routes";
import { AccountRouter } from "../endpoints/account//account.routes";
import { AuthRouter } from "../endpoints/auth/auth.routes";
import { ExerciseTypeRouter } from "../endpoints/exercise-type";
import { ExerciseCategoryRouter } from "../endpoints/exercise-category";
import { MachineRouter } from "../endpoints/machine";
import { PlanRouter } from "../endpoints/plan";
import { ReservationRouter } from "../endpoints/reservation";

export const setRoutes = (app: Express) => {
    app.use('/api/address', AddressRouter);
    app.use('/api/exercise-type', ExerciseTypeRouter)
    app.use('/api/reservation', ReservationRouter);
    app.use('/api/machine', MachineRouter)
    app.use('/api/auth', AuthRouter)
    app.use('/api/account', AccountRouter);
    app.use('/api/plan', PlanRouter)
    app.use('/api/exercise-category', ExerciseCategoryRouter)
}
