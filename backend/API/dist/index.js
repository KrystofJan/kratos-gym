import express from "express";
import cors from 'cors';
import { setRoutes } from './Routers/routes.js';
var app = express();
var PORT = 8080;
app.use(express.json());
app.use(cors());
setRoutes(app);
app.listen(PORT, function () { return console.log("Running on http://localhost:".concat(PORT)); });
