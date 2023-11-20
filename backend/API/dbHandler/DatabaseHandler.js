const mysql = require('mysql2');
const apiLogger = require('../ApiLoggerLogic/ApiLogger');
const Validators = require('./DatabaseValidators');
const dbKeys = require('./keys/table-keys.json');

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
    dbDisconnect(){
        this.db.end((err) => {
            if(err){
                apiLogger.logApi("an error occured while trying to disconnectiong to the database!\nError: "+ err);
            }
            apiLogger.logApi('Disconnected from the MySQL database');
        });
    }

    dbSelectAddress(res, req){
        this.db.query('SELECT * FROM Address', (err, results) => {
            if (err) {
              console.error('Error querying the database:', err);
              apiLogger.logApi(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            res.json(results);

            // const addr = new Address();
            // addr.constructFromJson(results[0]);

            apiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
        });
    }

    dbSelectAll(res, tableName){
        this.db.query('SELECT * FROM ' + tableName, (err, results) => {
            if (err) {
              console.error('Error querying the database:', err);
              apiLogger.logApi(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            res.json(results);

            const addr = new Address();
            addr.constructFromJson(results[0]);

            apiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
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

            apiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
        });
    }

    dbRecommendMachine(res,id){
        if(!Validators.validateNumericId(id)){
            console.error('Cannot use this ID', id);
            res.status(500).json({ error: 'Cannot pass in id that\'s not a number! Id: '+ id });
            apiLogger.logApi("Cannot use this WrkOutMachineId ! --" + id);
            return;
        }
        this.db.query(
        'SELECT wm.WrkOutMachineId, wm.MachineName, ET.ExerciseTypeName, ET.BodyPart, wm.PopularityScore '+
        'FROM WrkOutMachine wm inner join MachineExerciseTypes met on wm.WrkOutMachineId = met.WrkOutMachineId ' +         
        'inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId ' +
        'Where ET.BodyPart in ( ' +
            'select  DISTINCT BodyPart '+
            'from MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId '+
            'where met.WrkOutMachineId = ' + id +') ' +
        'and ET.Category in ( ' +
            'select Category '+
            'From MachineExerciseTypes met inner join ExerciseType ET on met.ExerciseTypeId = ET.ExerciseTypeId '+
            'Where met.WrkOutMachineId = ' + id + ') '+
        'and wm.WrkOutMachineId != ' + id + ' ' +
        'order by wm.PopularityScore desc ' +
        'LIMIT 5'
        ,(err, results) => {
            if (err) {
              console.error('Error querying the database:', err);
              apiLogger.logApi(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }
            res.json(results);

            apiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
        });
    }

    dbSelectSpecificReservation(res,id){
        if(!Validators.validateNumericId(id)){
            console.error('Cannot use this ID', id);
            res.status(500).json({ error: 'Cannot pass in id that\'s not a number! Id: '+ id });
            apiLogger.logApi("Cannot use this ReservationId ! --" + id);
        }

        this.db.query('SELECT * FROM Reservation WHERE ReservetionId = ' + id + ';', (err, results) => {
            if (err) {
              console.error('Error querying the database:', err);
              apiLogger.logApi(err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }
            res.json(results);
            apiLogger.logApi("Get request on the Reservations endpoint was Successfull!");
        });
    }

    dbSelectSpecific(res, id, tableName){
        return new Promise((resolve, reject) => {
            let pkey = dbKeys[tableName];
            let resp = [];
            if(!Validators.validateNumericId(id)){
                console.error('Cannot use this ID', id);
                res.status(500).json({ error: 'Cannot pass in id that\'s not a number! Id: '+ id });
                apiLogger.logApi("Cannot use this"+ pkey + " ! --" + id);
                reject("Invelid Id");
            }
    
            this.db.query('SELECT * FROM '+ tableName + ' WHERE '+ pkey +' = ' + id + ';', (err, results) => {
                if (err) {
                  console.error('Error querying the database:', err);
                  apiLogger.logApi(err);
                  res.status(500).json({ error: 'Internal Server Error' });
                  reject(err);
                }
                res.json(results);
                resolve(results);
                apiLogger.logApi("Get request on the " + tableName +" endpoint was Successfull!");
                
            });
            
        })
        // return resp;
    }
}
module.exports = DatabaseHandler;
