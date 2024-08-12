import { postMachineToPlan, getExerciseTypeByPlanId, postExerciseTypeToPlan, getMachineByPlanId } from './../Controller/WrkOutPlanController.js';
import express from 'express';
export var PlanRouter = express.Router();
WrkOutPlanRouter.get('/', function (req, res) {
    getAllPlans(req, res);
});
WrkOutPlanRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getPlanById(req, res, id);
});
WrkOutPlanRouter.get('/:id/machines', function (req, res) {
    var id = parseInt(req.params['id']);
    getMachineByPlanId(req, res, id);
});
PlanRouter.get('/:id/types', function (req, res) {
    var id = parseInt(req.params['id']);
    getExerciseTypeByPlanId(req, res, id);
});
WrkOutPlanRouter.post('/', function (req, res) {
    postPlan(req, res);
});
WrkOutPlanRouter.post('/:id/addMachine', function (req, res) {
    var id = parseInt(req.params['id']);
    postMachineToPlan(req, res, id);
});
PlanRouter.post('/:id/addType', function (req, res) {
    var id = parseInt(req.params['id']);
    postExerciseTypeToPlan(req, res, id);
});
