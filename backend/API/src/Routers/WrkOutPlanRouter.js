const express = require('express');
const wrkOutPlanController = require('../Controller/WrkOutPlanController');

const WrkOutPlanRouter = express.Router();

WrkOutPlanRouter.get('/', (req, res) => {
    wrkOutPlanController.getAll(req, res);
});

WrkOutPlanRouter.get('/:id', (req, res) => {
    wrkOutPlanController.getId( req,res,req.params['id']);
})

module.exports = WrkOutPlanRouter;