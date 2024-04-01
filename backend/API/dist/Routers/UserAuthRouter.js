import { LogIn, Register } from './../Controller/UserController.js';
import express from 'express';
export var UserAuthRouter = express.Router();
UserAuthRouter.post('/login', function (req, res) {
    LogIn(req, res);
});
UserAuthRouter.post('/register', function (req, res) {
    Register(req, res);
});
