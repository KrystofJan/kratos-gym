import express from 'express';
import { getAllAddresses, getAddressById, postAddress } from '../Controller/AddressController.js';
export var AddressRouter = express.Router();
AddressRouter.get('/', function (req, res) {
    getAllAddresses(req, res);
});
AddressRouter.get('/:id', function (req, res) {
    getAddressById(req, res, parseInt(req.params['id']));
});
AddressRouter.post('/', function (req, res) {
    postAddress(req, res);
});
