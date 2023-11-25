
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

import { auth } from '../auth/auth.middleware'
import {
  deleteOrderItem,
  getOrderItems
} from './order.controller'

export const orderRouter = Router({ mergeParams: true })

orderRouter.use(auth)

orderRouter.get('/', auth, getOrderItems)

orderRouter.delete('/:productId/:orderId/', auth, deleteOrderItem)
