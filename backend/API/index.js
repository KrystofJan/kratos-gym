const express = require('express');
const router = require('./src/Routers/routes');
const app = express();

router.setRoutes(app);

app.use(express.json());

const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);
