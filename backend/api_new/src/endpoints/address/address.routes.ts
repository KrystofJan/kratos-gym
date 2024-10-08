import express, { Request, Response, Router } from 'express';
import { AddressController } from './adress.controller';
import { Address } from './address.model';

export const AddressRouter: Router = express.Router();

AddressRouter.get('/', async (req: Request, res: Response) => {
    await AddressController.FindAll(req, res)
});
//
AddressRouter.get('/:id', async (req: Request, res: Response) => {
    await AddressController.FindById(req, res)
});
AddressRouter.post('/', async (req: Request, res: Response) => {
    await AddressController.Create(req, res)
});
