const express = require('express');
const addressController = require('../Controller/AddressController');

const AddressRouter = express.Router();


AddressRouter.get('/', (req, res) => {
    addressController.getAll(req, res);
});

module.exports = AddressRouter;