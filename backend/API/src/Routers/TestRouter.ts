
import express, { Request, Response, Router } from 'express';
import { TestDAO } from '../DataLayer/AccessModels/TestDAO.js';

export const Test: Router = express.Router();

Test.get('/', async (req: Request, res: Response) => {
    try {
        const result = await new TestDAO().getAll();
        res.status(200).json(result);
    }
    catch (error) {
        console.log("Nastala chyba: " + error);
    }
});

Test.get('/:id', async (req: Request, res: Response) => {

    try {
        const result = await new TestDAO().getId(parseInt(req.params['id']));
        res.status(200).json(result);
    }
    catch (error) {
        console.log("Nastala chyba: " + error);
    }
});

Test.post('/', async (req: Request, res: Response) => {
    try {
        const result = await new TestDAO().post(req.body);
        res.status(200).json(result);
    }
    catch (error) {
        console.log("Nastala chyba: " + error);
    }
});
