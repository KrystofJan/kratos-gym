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
    // Query the database to retrieve data
      handler.dbSelectALlReservations(res, req);
    
  });


app.get('/api/suggestMachines/:id', (req, res) => {
  // db.query('SELECT * FROM Reservation', (err, results) => {
  //   if (err) {
  //     console.error('Error querying the database:', err);
  //     apiLogger.logApi(err);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //     return;
  //   }
    
  //   res.json(results);
  //   apiLogger.logApi("Get request on the Reservations endpoint was Successfull!")
  // });
});