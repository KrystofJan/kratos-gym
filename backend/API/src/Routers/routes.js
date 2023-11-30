const reservationRouter = require('./ReservationRouter');
const addressRouter = require('./AddressRouter');


const setRoutes = (app) => {
    console.log("sdsd");
app.use('/api/reservations', reservationRouter);
app.use('/api/address', addressRouter);
}

// router.get('/suggestMachines/:id', (req, res) => {
//     handler.dbRecommendMachine(res, req.params['id']);
// });

module.exports = {
    setRoutes,
};