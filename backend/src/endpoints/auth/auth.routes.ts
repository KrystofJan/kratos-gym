import express, { Request, Response, Router } from 'express'
import { AuthController } from './auth.controller'

export const AuthRouter: Router = express.Router()
AuthRouter.post('/new-account', async (req: Request, res: Response) => {
    await AuthController.CreateAccount(req, res)
})
