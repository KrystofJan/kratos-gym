const reservationRouter = require('./ReservationRouter');
const addressRouter = require('./AddressRouter');
const wrkOutPlanRouter = require('./WrkOutPlanRouter');
const wrkOutMachineRouter = require('./WrkOutMachineRouter');


const setRoutes = (app) => {
app.use('/api/reservations', reservationRouter);
app.use('/api/address', addressRouter);
app.use('/api/plan', wrkOutPlanRouter);
app.use('/api/machine', wrkOutMachineRouter); // TODO FIX !
}

// router.get('/suggestMachines/:id', (req, res) => {
//     handler.dbRecommendMachine(res, req.params['id']);
// });

module.exports = {
    setRoutes,
};