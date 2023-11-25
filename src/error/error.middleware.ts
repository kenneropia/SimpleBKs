import HttpException from './http-exception'
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
  error: HttpException,
  _request: Request,
  response: Response,
  _next: NextFunction
): Response => {
  const status = error.statusCode ?? error.status ?? 500
  if (status !== undefined && (status === 0 || (status?.toString().startsWith('5')))) {
    return response.status(status).send({ statusCode: status, message: 'Internal Server Code' })
  }
  return response.status(status).send({ statusCode: status, message: error.message })
}
