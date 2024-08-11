import { Express } from 'express';

import { ReservationRouter } from './ReservationRouter.js';
import { AddressRouter } from './AddressRouter.js';
import { ExerciseTypeRouter } from './ExerciseTypeRouter.js';

import { MachineExerciseTypesRouter } from './MachineExerciseTypesRouter.js';
import { Test } from './TestRouter.js';
import { MachineRouter } from './MachineRouter.js';
import { UserAuthRouter } from './UserAuthRouter.js';
import { UserRouter } from './UserRouter.js';
import { PlanRouter } from './PlanRouter.js'

// const wrkOutPlanRouter = require('./PlanRouter');
// const wrkOutPlanPresetRouter = require('./PlanPresetRouter');
// const wrkOutMachineRouter = require('./MachineRouter');
// const userAuthRouter = require('./UserAuthRouter');
// const wrkOutPlanTypeRouter = require('./PlanTypeRouter');
// const wrkOutPlanMachineRouter = require('./PlanMachineRouter');
// const wrkOutPlanMachinePresetRouter = require('./PlanMachinePresetRouter');


export const setRoutes = (app: Express) => {
    app.use('/api/test', Test);
    app.use('/api/address', AddressRouter);
    app.use('/api/exercise-type', ExerciseTypeRouter);
    app.use('/api/reservation', ReservationRouter);
    app.use('/api/machine-type', MachineExerciseTypesRouter);
    app.use('/api/machine', MachineRouter);
    app.use('/api/userauth', UserAuthRouter);
    app.use('/api/account', UserRouter);
    app.use('/api/plan', PlanRouter);
    // app.use('/api/plan-type', wrkOutPlanTypeRouter);
    // app.use('/api/plan-machine', wrkOutPlanMachineRouter);
    // app.use('/api/plan/preset', wrkOutPlanPresetRouter);
    // app.use('/api/plan-machine/preset', wrkOutPlanMachinePresetRouter);

}
