const express = require('express');
const wrkOutPlanMachinePresetController = require('../Controller/WrkOutPlanMachinePresetController');

const WrkOutPlanMachinePresetRouter = express.Router();

WrkOutPlanMachinePresetRouter.get('/plan/:id', (req, res) => {
    wrkOutPlanMachinePresetController.getIdPreset(req, res,req.params['id']);
});

WrkOutPlanMachinePresetRouter.get('/machine/:id', (req, res) => {
    wrkOutPlanMachinePresetController.getIdMachine( req,res,req.params['id']);
});

WrkOutPlanMachinePresetRouter.post('/', (req, res) => {
    wrkOutPlanMachinePresetController.post(req, res);
})

module.exports = WrkOutPlanMachinePresetRouter;
