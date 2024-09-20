import express, { Request, Response as expRes, Router } from 'express';
import { AddressController } from './adress.controller';
import { Address } from './address.model';

export const AddressRouter: Router = express.Router();

AddressRouter.get('/', async (req: Request, res: expRes) => {
    await AddressController.FindAll(req, res)
});
//
// AddressRouter.get('/:id', (req: Request, res: Response) => {
// });
//
// AddressRouter.post('/', (req: Request, res: Response) => {
// });
