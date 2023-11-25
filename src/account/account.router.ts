/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'

import { auth } from '../auth/auth.middleware'
import { updateAccountLocation } from './account.controller'

export const accountRouter = Router({ mergeParams: true })

accountRouter.use(auth)

accountRouter.patch('/', auth, updateAccountLocation)
