const express = require('express');
const dbHandler = require('./dbHandler/DatabaseHandler.js');
const apiLogger = require('./ApiLoggerLogic/ApiLogger');
const mysql = require('mysql2');
const app = express();
const PORT = 8080;

// db connect
const handler = new dbHandler();

handler.dbConnect();

app.use(express.json());


app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);

app.get('/api/reservations', (req, res) => {
      handler.dbSelectALlReservations(res, req);    
});

app.get('/api/suggestMachines/:id', (req, res) => {
    handler.dbRecommendMachine(res, req.params['id']);
});