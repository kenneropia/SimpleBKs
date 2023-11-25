import { Request, Response, NextFunction } from 'express'
import { AuthPayload } from '../auth/auth.interface'
import { DB } from '../lib/db'
import { Seller } from './account.interface'
import { parseString } from '../lib/validate'

export const updateAccountLocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { city, state } = req.body
    const { sellerId, sellerZipCodePrefix } = req.currentUser as AuthPayload

    const db = await DB.getClient()
    const collection = db.collection<Seller>('sellers')

    const updateFields: Record<string, string> = {
    }

    if (city !== undefined) {
      updateFields.sellerCity = parseString('city', city)
    }

    if (state !== undefined) {
      updateFields.sellerState = parseString('state', state)
    }

    const result = await collection.findOneAndUpdate(
      { sellerId, sellerZipCodePrefix },
      { $set: updateFields },
      { returnDocument: 'after' }
    )

    res.json({ data: { city: result?.sellerCity, state: result?.sellerState } })
  } catch (error) {
    next(error)
  }
}
