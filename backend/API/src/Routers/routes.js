const reservationRouter = require('./ReservationRouter');
const addressRouter = require('./AddressRouter');
const wrkOutPlanRouter = require('./WrkOutPlanRouter');
const wrkOutMachineRouter = require('./WrkOutMachineRouter');
const userAuthRouter = require('./UserAuthRouter');
const exerciseTypeRouter = require('./ExerciseTypeRouter');
const machineExerciseTypesRouter = require('./MachineExerciseTypesRouter');
const wrkOutPlanTypeRouter = require('./WrkOutPlanTypeRouter');

const setRoutes = (app) => {
    app.use('/api/reservation', reservationRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/plan', wrkOutPlanRouter);
    app.use('/api/machine', wrkOutMachineRouter);
    app.use('/api/userauth',userAuthRouter);
    app.use('/api/exercise-type', exerciseTypeRouter);
    app.use('/api/mach-ex-type', machineExerciseTypesRouter);
    app.use('/api/plan-type', wrkOutPlanTypeRouter);
}

module.exports = {
    setRoutes,
};
