const reservationRouter = require('./ReservationRouter');
const addressRouter = require('./AddressRouter');
const wrkOutPlanRouter = require('./WrkOutPlanRouter');
const wrkOutMachineRouter = require('./WrkOutMachineRouter');
const userAuthRouter = require('./UserAuthRouter');
const exerciseTypeRouter = require('./ExerciseTypeRouter');
const machineExerciseTypesRouter = require('./MachineExerciseTypesRouter');

const setRoutes = (app) => {
    app.use('/api/reservations', reservationRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/plan', wrkOutPlanRouter);
    app.use('/api/machine', wrkOutMachineRouter);
    app.use('/api/userauth',userAuthRouter);
    app.use('/api/exercise-type', exerciseTypeRouter);
    app.use('/api/mach-ex-type', machineExerciseTypesRouter);
}

module.exports = {
    setRoutes,
};