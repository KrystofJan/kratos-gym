const reservationRouter = require('./ReservationRouter');
const addressRouter = require('./AddressRouter');
const wrkOutPlanRouter = require('./WrkOutPlanRouter');
const wrkOutMachineRouter = require('./WrkOutMachineRouter');
const userAuthRouter = require('./UserAuthRouter');


const setRoutes = (app) => {
    app.use('/api/reservations', reservationRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/plan', wrkOutPlanRouter);
    app.use('/api/machine', wrkOutMachineRouter); // TODO FIX !
    app.use('/api/userauth',userAuthRouter);
}

module.exports = {
    setRoutes,
};