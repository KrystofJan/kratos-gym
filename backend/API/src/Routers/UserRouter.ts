import { GetId } from './../Controller/UserController.js';
import express, { Request, Response, Router } from 'express';

export const UserRouter = express.Router();

UserRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params['id']);
    GetId(req, res, id);
});
