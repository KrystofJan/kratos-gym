const express = require('express');
const userController = require('../Controller/UserController');

const UserRouter = express.Router();

UserRouter.get('/login', (req, res) => {
    userController.loginAuth(req, res);
});

UserRouter.post('/register', (req, res) => {
    userController.register(req, res);
});

module.exports = UserRouter;