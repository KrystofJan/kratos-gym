const reservationRouter = require('./ReservationRouter');
const addressRouter = require('./AddressRouter');
const wrkOutPlanRouter = require('./WrkOutPlanRouter');
const wrkOutPlanPresetRouter = require('./WrkOutPlanPresetRouter');
const wrkOutMachineRouter = require('./WrkOutMachineRouter');
const userAuthRouter = require('./UserAuthRouter');
const exerciseTypeRouter = require('./ExerciseTypeRouter');
const machineExerciseTypesRouter = require('./MachineExerciseTypesRouter');
const wrkOutPlanTypeRouter = require('./WrkOutPlanTypeRouter');
const wrkOutPlanMachineRouter = require('./WrkOutPlanMachineRouter');

const setRoutes = (app) => {
    app.use('/api/reservation', reservationRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/plan', wrkOutPlanRouter);
    app.use('/api/machine', wrkOutMachineRouter);
    app.use('/api/userauth',userAuthRouter);
    app.use('/api/exercise-type', exerciseTypeRouter);
    app.use('/api/machine-type', machineExerciseTypesRouter);
    app.use('/api/plan-type', wrkOutPlanTypeRouter);
    app.use('/api/plan-machine', wrkOutPlanMachineRouter);
    app.use('/api/plan-preset', wrkOutPlanPresetRouter);
}

module.exports = {
    setRoutes,
};
