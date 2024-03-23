import { Express } from 'express';

// import { ReservationRouter } from './ReservationRouter.js';
import { AddressRouter } from './AddressRouter.js';
import { ExerciseTypeRouter } from './ExerciseTypeRouter.js';

// import { MachineExerciseTypesRouter } from './MachineExerciseTypesRouter.js';
import { Test } from './TestRouter.js';


// const wrkOutPlanRouter = require('./WrkOutPlanRouter');
// const wrkOutPlanPresetRouter = require('./WrkOutPlanPresetRouter');
// const wrkOutMachineRouter = require('./WrkOutMachineRouter');
// const userAuthRouter = require('./UserAuthRouter');
// const wrkOutPlanTypeRouter = require('./WrkOutPlanTypeRouter');
// const wrkOutPlanMachineRouter = require('./WrkOutPlanMachineRouter');
// const wrkOutPlanMachinePresetRouter = require('./WrkOutPlanMachinePresetRouter');
// const userRouter = require('./UserRouter');

export const setRoutes = (app: Express) => {
    app.use('/api/test', Test);
    app.use('/api/address', AddressRouter);
    app.use('/api/exercise-type', ExerciseTypeRouter);

    // app.use('/api/reservation', ReservationRouter);
    // app.use('/api/machine-type', MachineExerciseTypesRouter);
    // app.use('/api/plan', wrkOutPlanRouter);
    // app.use('/api/machine', wrkOutMachineRouter);
    // app.use('/api/userauth',userAuthRouter);
    // app.use('/api/plan-type', wrkOutPlanTypeRouter);
    // app.use('/api/plan-machine', wrkOutPlanMachineRouter);
    // app.use('/api/plan/preset', wrkOutPlanPresetRouter);
    // app.use('/api/plan-machine/preset', wrkOutPlanMachinePresetRouter);
    // app.use('/api/user', userRouter);
}
