import { getAllMachines, getMachineById, recommendMachine, postMachine, isOccupied } from './../Controller/MachineController.js';
import express from 'express';
export var MachineRouter = express.Router();
MachineRouter.get('/', function (req, res) {
    getAllMachines(req, res);
});
MachineRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getMachineById(req, res, id);
});
MachineRouter.post('/', function (req, res) {
    postMachine(req, res);
});
MachineRouter.get('/recommend/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    recommendMachine(req, res, id); // TODO fix!
});
MachineRouter.get('/:id/occupied', function (req, res) {
    var id = parseInt(req.params['id']);
    isOccupied(req, res, id);
});
