const express = require('express');
const wrkOutPlanMachineController = require('../Controller/WrkOutPlanMachineController');

const WrkOutPlanMachineRouter = express.Router();

WrkOutPlanMachineRouter.get('/plan/:id', (req, res) => {
    wrkOutPlanMachineController.getIdPlan(req, res,req.params['id']);
});
WrkOutPlanMachineRouter.get('/machine/:id', (req, res) => {
    wrkOutPlanMachineController.getIdMachine( req,res,req.params['id']);
});

WrkOutPlanMachineRouter.get('/:id&time=:time&date=:date', (req, res) => {
    wrkOutPlanMachineController.getOccupiedMachineAmount( req,res,req.params['id'],req.params['time'], req.params['date']);
});

WrkOutPlanMachineRouter.post('/', (req, res) => {
    wrkOutPlanMachineController.post(req, res);
})

module.exports = WrkOutPlanMachineRouter;
