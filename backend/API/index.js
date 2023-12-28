const express = require('express');
const cors = require('cors');
const router = require('./src/Routers/routes');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json());
app.use(cors());

router.setRoutes(app);

app.use(express.json());

const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);
