import { GetId } from './../Controller/UserController.js';
import express from 'express';
export var UserRouter = express.Router();
UserRouter.get('/:id', function (req, res) {
    var id = parseInt(req.params['id']);
    GetId(req, res, id);
});
