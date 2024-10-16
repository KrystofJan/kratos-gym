import { Express } from "express";
import { AddressRouter } from "../endpoints/address/address.routes";
import { AccountRouter } from "../endpoints/account//account.routes";
import { AuthRouter } from "../endpoints/auth/auth.routes";
import { ExerciseTypeRouter } from "../endpoints/exercise-type";
import { MachineRouter } from "../endpoints/machine";
import { PlanRouter } from "../endpoints/plan";

export const setRoutes = (app: Express) => {
    app.use('/api/address', AddressRouter);
    app.use('/api/account', AccountRouter);
    app.use('/api/auth', AuthRouter)
    app.use('/api/exercise-type', ExerciseTypeRouter)
    app.use('/api/machine', MachineRouter)
    app.use('/api/plan', PlanRouter)
}
