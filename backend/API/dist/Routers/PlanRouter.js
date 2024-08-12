import { getAllPlans, getPlanById, postMachineToPlan, getExerciseTypeByPlanId, postPlan, postExerciseTypeToPlan, getMachineByPlanId } from './../Controller/PlanController.js';
import express from 'express';
export var PlanRouter = express.Router();
PlanRouter.get('/', function (req, res) {
    getAllPlans(req, res);
});
PlanRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    getPlanById(req, res, id);
});
PlanRouter.get('/:id/machines', function (req, res) {
    var id = parseInt(req.params['id']);
    getMachineByPlanId(req, res, id);
});
PlanRouter.get('/:id/types', function (req, res) {
    var id = parseInt(req.params['id']);
    getExerciseTypeByPlanId(req, res, id);
});
PlanRouter.post('/', function (req, res) {
    postPlan(req, res);
});
PlanRouter.post('/:id/addMachine', function (req, res) {
    var id = parseInt(req.params['id']);
    postMachineToPlan(req, res, id);
});
PlanRouter.post('/:id/addType', function (req, res) {
    var id = parseInt(req.params['id']);
    postExerciseTypeToPlan(req, res, id);
});
