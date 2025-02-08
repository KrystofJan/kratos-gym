import express, { Request, Response, Router } from 'express'
import { PlanGeneratorController } from './plan-generator.controller'

export const generatorRouter: Router = express.Router()

generatorRouter.post('/generate', async (req: Request, res: Response) => {
    await PlanGeneratorController.Generate(req, res)
})
