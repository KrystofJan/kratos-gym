import { getAllWrkOutMachines, getWrkOutMachineById, recommendMachine, postWrkOutMachine, isOccupied } from './../Controller/WrkOutMachineController.js';
import express from 'express';
export var WrkOutMachineRouter = express.Router();
WrkOutMachineRouter.get('/', function (req, res) {
    getAllWrkOutMachines(req, res);
});
WrkOutMachineRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getWrkOutMachineById(req, res, id);
});
WrkOutMachineRouter.post('/', function (req, res) {
    postWrkOutMachine(req, res);
});
WrkOutMachineRouter.get('/recommend/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    recommendMachine(req, res, id); // TODO fix!
});
WrkOutMachineRouter.get('/:id/occupied', function (req, res) {
    var id = parseInt(req.params['id']);
    isOccupied(req, res, id);
});
