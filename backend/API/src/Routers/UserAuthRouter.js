const express = require('express');
const userController = require('../Controller/UserController');

const UserRouter = express.Router();

UserRouter.post('/login', (req, res) => {
    userController.loginAuth(req, res);
});

UserRouter.post('/register', (req, res) => {
    userController.register(req, res);
});

module.exports = UserRouter;