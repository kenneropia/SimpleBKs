
import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { errorHandler } from './error/error.middleware'
import { notFoundHandler } from './error/not-found.middleware'
import morgan from 'morgan'
import Logger from './lib/logger'
import { auth } from './auth/auth.middleware'
import { orderRouter } from './order/order.router'
import { accountRouter } from './account/account.router'

export const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const stream = {
  write: (text: string) => {
    Logger.info(text)
  }
}

app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length]',
    {
      stream
    }
  )
)
/* eslint-disable @typescript-eslint/no-misused-promises */
app.get('/', (_req: Request, res: Response) => {
  res.status(200).send('Server is running')
})

app.use('/order_items', orderRouter)
app.use('/account', accountRouter)

app.use(errorHandler)
app.use(notFoundHandler)
