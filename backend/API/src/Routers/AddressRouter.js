const express = require('express');
const addressController = require('../Controller/AddressController');

const AddressRouter = express.Router();


AddressRouter.get('/', (req, res) => {
    addressController.getAll(req, res);
});

AddressRouter.get('/:id', (req, res) => {
    addressController.getId(req, res, req.params['id']);
});

AddressRouter.post('/', (req, res) => {
    addressController.post(req, res);
})
module.exports = AddressRouter;