
import HttpException from '../error/http-exception'
import {
  AuthPayload

} from './auth.interface'

export const getDecodedCredentials = (authHeader: string): AuthPayload => {
  try {
    const encodedCredentials = authHeader.replace('Basic ', '')
    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8')
    const [sellerId, sellerZipCodePrefix] = decodedCredentials.split(':')

    return { sellerId, sellerZipCodePrefix: Number(sellerZipCodePrefix) }
  } catch (error) {
    throw new HttpException(401, 'Invalid Token or expired!')
  }
}

export const encodeCredentials = (sellerId: string, sellerZipCodePrefix: number): string => {
  if (process.env.NODE_ENV !== 'test') throw Error('This function is meant to be used in test only')

  try {
    const credentials = `${sellerId}:${sellerZipCodePrefix}`
    const encodedCredentials = Buffer.from(credentials, 'utf-8').toString('base64')
    const authHeader = `Basic ${encodedCredentials}`

    return authHeader
  } catch (error) {
    throw new HttpException(500, 'Internal Server Error')
  }
}
