import express, { Request, Response, Router } from 'express';
import { Address } from '../address/address.model';
import { SelectQuery } from '../../database/query-builder';

export const AccountRouter: Router = express.Router();

AccountRouter.get('/', async (req: Request, res: Response) => {
    const query = new SelectQuery(Address)
        .Params("AddressId", 'City')
        .Where({ 'City': ['=', 'Frýdek-Místek'] })
        .OrderBy('City', 'desc')
        .Limit(10)
        .Offset(5);

    console.log(query.toSQL());
    res.send(query.toSQL());
});
