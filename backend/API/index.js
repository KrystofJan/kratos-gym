const express = require('express');
// const dbHandler = require('./dbHandler/DatabaseHandler.js');
const apiLogger = require('./ApiLoggerLogic/ApiLogger');
const mysql = require('mysql2');
const Address = require('./dbHandler/ORM/Models/Address');
const Reservation = require('./dbHandler/ORM/Models/Reservation');


const app = express();

const PORT = 8080;

// db connect
// const handler = new dbHandler();

// handler.dbConnect();

app.use(express.json());


app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);

// app.get('/api/reservations', (req, res) => {
//       handler.dbSelectALlReservations(res, req);    
// });

app.get('/api/address', (req, res) => {
    const addr = new Address();
    addr.getAll(res, req);
});

app.get('/api/reservations/:id', (req, res) => {
    const reserv = new Reservation();
    reserv.getId(res ,req.params['id']);
})

// // app.get()

// app.get('/api/suggestMachines/:id', (req, res) => {
//     handler.dbRecommendMachine(res, req.params['id']);
// });

