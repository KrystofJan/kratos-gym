const express = require('express');
const wrkOutPlanTypeController = require('../Controller/WrkOutPlanTypeController');

const WrkOutPlanTypeRouter = express.Router();

WrkOutPlanTypeRouter.get('/plan/:id', (req, res) => {
    wrkOutPlanTypeController.getIdPlan(req, res,req.params['id']);
});

WrkOutPlanTypeRouter.get('/type/:id', (req, res) => {
    wrkOutPlanTypeController.getIdType( req,res,req.params['id']);
});

WrkOutPlanTypeRouter.post('/', (req, res) => {
    wrkOutPlanTypeController.post(req, res);
})

module.exports = WrkOutPlanTypeRouter;
