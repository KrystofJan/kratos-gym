const express = require('express');
const app = express();
const mysql = require('mysql2');
const PORT = 8080;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    database: 'Kratos',
  });
db.connect((err) =>{
    if(err){
        console.log("an error occured while trying to connect to the database!\nError: "+ err);
    }
    console.log('Connected to the MySQL database');
});
app.use(express.json());


app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);

app.get('reservations', (request, response) => {})

app.get('/api/reservations', (req, res) => {
    // Query the database to retrieve data
    db.query('SELECT * FROM Reservation', (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      res.json(results);
    });
  });
app.get('/tshirt',(request, response) =>
{
    response.status(200).send(
        {
            tshirt: 'asd',
            size: 'xxl'
        }
    )
});