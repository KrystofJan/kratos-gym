import express, { Request, Response, Router } from 'express'
import { Address } from '../address/address.model'
import { SelectQuery } from '../../database/query-builder'
import { TestingController } from './testing.controller'
import { clerkClient, requireAuth } from '@clerk/express'

export const DBRouter: Router = express.Router()

DBRouter.get('/', async (req: Request, res: Response) => {
    await TestingController.FindAll(req, res)
})

export const testRouter: Router = express.Router()

testRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).json({ status: 'up' })
})

testRouter.get('/version', async (req: Request, res: Response) => {
    res.status(200).json({ version: '1.0' })
})
