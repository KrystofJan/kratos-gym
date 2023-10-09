const mysql = require('mysql2');
const apiLogger = require('../ApiLoggerLogic/ApiLogger');

class DatabaseHandler{
    constructor(){
        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'admin',
            password: 'admin',
            database: 'Kratos',
          });
    }
    dbConnect(){
        this.db.connect((err) => {
            if(err){
                apiLogger.logApi("an error occured while trying to connect to the database!\nError: "+ err);
            }
            apiLogger.logApi('Connected to the MySQL database');
        });
    }

    dbSelectALlReservations(res,req){
        this.db.query('SELECT * FROM Reservation', (err, results) => {
            if (err) {
              console.error('Error querying the database:', err);
              apiLogger.logApi(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            res.json(results);
            console.log(handler.dbSelectALlReservations());
            apiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
        });
    }

}
module.exports = DatabaseHandler;