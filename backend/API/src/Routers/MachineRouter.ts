import { getAllMachines, getMachineById, recommendMachine, postMachine, isOccupied } from './../Controller/MachineController.js';
import express, { Request, Response, Router } from 'express';

export const MachineRouter = express.Router();

MachineRouter.get('/', (req, res) => {
    getAllMachines(req, res);
});

MachineRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    getMachineById(req, res, id);
});

MachineRouter.post('/', (req, res) => {
    postMachine(req, res);
});

MachineRouter.get('/recommend/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    recommendMachine(req, res, id); // TODO fix!
});

MachineRouter.get('/:id/occupied', (req, res) => {
    const id = parseInt(req.params['id']);
    isOccupied(req, res, id);
});
