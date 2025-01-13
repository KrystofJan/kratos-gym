import express from 'express'
import * as dotevnv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import { setRoutes } from './router/router'
import { logger } from './utils'

dotevnv.config()

if (!process.env.PORT) {
    logger.info(`No port value specified...`)
}

const PORT = parseInt(process.env.PORT as string, 10)

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())

setRoutes(app)

app.listen(PORT, () => {
    logger.info(`Server asdasd is listening on http://localhost:${PORT}`)
})
