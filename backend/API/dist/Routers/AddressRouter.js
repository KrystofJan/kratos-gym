import express from 'express';
import { getAllAddresses, getAddressById, postAddress } from '../Controller/AddressController.js';
export const AddressRouter = express.Router();
AddressRouter.get('/', (req, res) => {
    getAllAddresses(req, res);
});
AddressRouter.get('/:id', (req, res) => {
    getAddressById(req, res, parseInt(req.params['id']));
});
AddressRouter.post('/', (req, res) => {
    postAddress(req, res);
});
