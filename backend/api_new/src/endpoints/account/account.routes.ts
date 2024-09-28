import express, { Request, Response, Router } from 'express';
import { Address } from '../address/address.model';
import { SelectQuery } from '../../database/query-builder';
import { AccountController } from './account.controller';

export const AccountRouter: Router = express.Router();

AccountRouter.get('/query', async (req: Request, res: Response) => {
    const query = new SelectQuery(Address)
        .Params("AddressId", 'City')
        .Where({ 'City': ['=', 'Frýdek-Místek'] })
        .OrderBy('City', 'desc')
        .Limit(10)
        .Offset(5);

    console.log(query.toSQL());
    res.send(query.toSQL());
});

AccountRouter.get('/', async (req: Request, res: Response) => {
    await AccountController.FindAll(req, res)
});

AccountRouter.get('/:id', async (req: Request, res: Response) => {
    await AccountController.FindById(req, res)
});

AccountRouter.get('/clerk/:id', async (req: Request, res: Response) => {
    await AccountController.FindByClerkId(req, res)
});
