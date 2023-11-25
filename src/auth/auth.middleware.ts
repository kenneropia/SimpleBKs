import { NextFunction, Request, Response } from 'express'
import { getDecodedCredentials } from './auth.utils'
import HttpException from '../error/http-exception'
import { DB } from '../lib/db'
import { AuthPayload } from './auth.interface'

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const auth = async (req: Request, _: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader !== undefined && authHeader !== null && typeof authHeader === 'string') {
      const decodedUser = getDecodedCredentials(authHeader)
      const db = await DB.getClient()

      const collection = db.collection<AuthPayload>('sellers')

      const user = await collection.findOne({
        sellerId: decodedUser.sellerId,
        sellerZipCodePrefix: decodedUser.sellerZipCodePrefix
      })

      if (user == null) {
        return next(new HttpException(401, 'Invalid token'))
      }

      req.currentUser = {
        sellerId: user.sellerId,
        sellerZipCodePrefix: user.sellerZipCodePrefix
      }
      return next()
    } else {
      return next(new HttpException(401, 'Unauthorized'))
    }
  } catch (error: unknown) {
    throw new HttpException(401, 'Invalid token')
  }
}
