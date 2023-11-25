import HttpException from '../error/http-exception'

const isString = (txt: unknown): txt is string => {
  return typeof txt === 'string' || txt instanceof String
}

export const parseString = (prop: string, str: unknown): string => {
  if (str === undefined || str === null || str === '') {
    throw new HttpException(400, `${prop} is required`)
  }
  if (!isString(str)) {
    throw new HttpException(400, prop + ': ' + String(str) + ' is meant to be a string')
  }

  return str
}

export const getEnvOrThrow = (variableName: string): string => {
  const value = process.env[variableName]

  if (value === undefined || value === null) {
    throw new Error(`${variableName} is not defined in the environment`)
  }

  return value
}
