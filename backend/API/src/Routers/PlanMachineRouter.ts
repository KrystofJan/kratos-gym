// const express = require('express');
// const wrkOutPlanMachineController = require('../Controller/PlanMachineController');

// const PlanMachineRouter = express.Router();

// PlanMachineRouter.get('/plan/:id', (req, res) => {
//     wrkOutPlanMachineController.getIdPlan(req, res,req.params['id']);
// });
// PlanMachineRouter.get('/machine/:id', (req, res) => {
//     wrkOutPlanMachineController.getIdMachine( req,res,req.params['id']);
// });

// PlanMachineRouter.get('/:id', (req, res) => {
//     const { time, date } = req.query;
//     wrkOutPlanMachineController.getOccupiedMachineAmount( req,res,req.params['id'],time, date);
// });

// PlanMachineRouter.post('/', (req, res) => {
//     wrkOutPlanMachineController.post(req, res);
// })

// module.exports = PlanMachineRouter;
