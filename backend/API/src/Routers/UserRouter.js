const express = require('express');
const userController = require('../Controller/UserController');

const UserRouter = express.Router();

UserRouter.get('/:id', (req, res) => {
    userController.getId(req, res, req.params['id']);
});

module.exports = UserRouter;