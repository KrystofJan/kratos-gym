import { Express } from 'express';

import { ReservationRouter } from './ReservationRouter.js';
import { AddressRouter } from './AddressRouter.js';
import { ExerciseTypeRouter } from './ExerciseTypeRouter.js';

import { MachineExerciseTypesRouter } from './MachineExerciseTypesRouter.js';
import { Test } from './TestRouter.js';
import { WrkOutMachineRouter } from './WrkOutMachineRouter.js';
import { UserAuthRouter } from './UserAuthRouter.js';
import { UserRouter } from './UserRouter.js';
import { WrkOutPlanRouter } from './WrkOutPlanRouter.js'

// const wrkOutPlanRouter = require('./WrkOutPlanRouter');
// const wrkOutPlanPresetRouter = require('./WrkOutPlanPresetRouter');
// const wrkOutMachineRouter = require('./WrkOutMachineRouter');
// const userAuthRouter = require('./UserAuthRouter');
// const wrkOutPlanTypeRouter = require('./WrkOutPlanTypeRouter');
// const wrkOutPlanMachineRouter = require('./WrkOutPlanMachineRouter');
// const wrkOutPlanMachinePresetRouter = require('./WrkOutPlanMachinePresetRouter');


export const setRoutes = (app: Express) => {
    app.use('/api/test', Test);
    app.use('/api/address', AddressRouter);
    app.use('/api/exercise-type', ExerciseTypeRouter);
    app.use('/api/reservation', ReservationRouter);
    app.use('/api/machine-type', MachineExerciseTypesRouter);
    app.use('/api/machine', WrkOutMachineRouter);
    app.use('/api/userauth', UserAuthRouter);
    app.use('/api/account', UserRouter);
    app.use('/api/plan', WrkOutPlanRouter);
    // app.use('/api/plan-type', wrkOutPlanTypeRouter);
    // app.use('/api/plan-machine', wrkOutPlanMachineRouter);
    // app.use('/api/plan/preset', wrkOutPlanPresetRouter);
    // app.use('/api/plan-machine/preset', wrkOutPlanMachinePresetRouter);

}
