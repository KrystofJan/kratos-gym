import express from "express";
import cors from 'cors';
import { setRoutes } from './Routers/routes.js';
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());
setRoutes(app);
app.listen(PORT);
