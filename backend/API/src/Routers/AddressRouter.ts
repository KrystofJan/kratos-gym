import express, { Request, Response, Router } from 'express';
import { getAllAddresses, getAddressById, postAddress} from '../Controller/AddressController.js';

export const AddressRouter: Router = express.Router();

AddressRouter.get('/', (req: Request, res: Response) => {
    getAllAddresses(req, res);
});

AddressRouter.get('/:id', (req: Request, res: Response) => {
    getAddressById(req, res, parseInt(req.params['id']));
});

AddressRouter.post('/', (req: Request, res: Response) => {
    postAddress(req, res);
});