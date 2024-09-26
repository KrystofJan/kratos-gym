import { clerkClient } from '@clerk/clerk-sdk-node'

import express, { Request, Response, Router } from 'express';
import { Address } from '../address';
import { AuthController } from './auth.controller';

export const AuthRouter: Router = express.Router();
AuthRouter.get('/new-account', async (req: Request, res: Response) => {
    // const xxx = await clerkClient.users.getUserList()
    // res.send(xxx)

    const resp = AuthController.CreateAccount(req, res);
    res.redirect("https://profiq.com/")
});
