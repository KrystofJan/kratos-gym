import express, { Request, Response, Router } from 'express';
import { AddressController } from './address.controller';

export const AddressRouter: Router = express.Router();

AddressRouter.get('/', async (req: Request, res: Response) => {
    await AddressController.FindAll(req, res)
});

AddressRouter.get('/:id', async (req: Request, res: Response) => {
    await AddressController.FindById(req, res)
});

AddressRouter.post('/', async (req: Request, res: Response) => {
    await AddressController.Create(req, res)
});

AddressRouter.delete('/:id', async (req: Request, res: Response) => {
    await AddressController.DeleteById(req, res)
});

AddressRouter.patch('/:id', async (req: Request, res: Response) => {
    await AddressController.UpdateById(req, res)
});
