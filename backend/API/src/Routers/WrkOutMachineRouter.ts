import {getAllWrkOutMachines, getWrkOutMachineById, recommendMachine, postWrkOutMachine  } from './../Controller/WrkOutMachineController.js';
import express, { Request, Response, Router } from 'express';

export const WrkOutMachineRouter = express.Router();

WrkOutMachineRouter.get('/', (req, res) => {
    getAllWrkOutMachines(req, res);
});

WrkOutMachineRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    getWrkOutMachineById( req,res,id);
});

WrkOutMachineRouter.post('/', (req, res) => {
    postWrkOutMachine( req,res);
});

WrkOutMachineRouter.get('/recommend/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    recommendMachine( req,res,id); // TODO fix!
});
