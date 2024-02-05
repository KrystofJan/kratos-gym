const express = require('express');
const wrkOutMachineController = require('../Controller/WrkOutMachineController');

const WrkOutMachineRouter = express.Router();

WrkOutMachineRouter.get('/', (req, res) => {
    wrkOutMachineController.getAll(req, res);
});

WrkOutMachineRouter.get('/:id', (req, res) => {
    wrkOutMachineController.getId( req,res,req.params['id']);
});

WrkOutMachineRouter.post('/', (req, res) => {
    wrkOutMachineController.post( req,res);
});

WrkOutMachineRouter.get('/recommend/:id', (req, res) => {
    wrkOutMachineController.recommendMachine( req,res,req.params['id']); // TODO fix!
});

module.exports = WrkOutMachineRouter;