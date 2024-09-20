import { LogIn, Register } from './../Controller/UserController.js';
import express from 'express';
export const UserAuthRouter = express.Router();
UserAuthRouter.post('/login', (req, res) => {
    LogIn(req, res);
});
UserAuthRouter.post('/register', (req, res) => {
    Register(req, res);
});
