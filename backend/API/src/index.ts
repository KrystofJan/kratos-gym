import express, { Express, Request, Response } from "express";
import cors from 'cors';
import { setRoutes } from './Routers/routes.js';
import { BodyParser } from 'body-parser';

const app: Express = express();
const PORT: number = 8080;

app.use(express.json());

app.use(cors());

setRoutes(app);

app.listen(
    PORT,
    () => console.log(`Running on http://localhost:${PORT}`)
);
