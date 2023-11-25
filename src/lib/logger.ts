import winston from 'winston'

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
}

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
}

winston.addColors(colors)

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.json(),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => String(info.timestamp) + ' ' + String(info.level) + ' ' + String(info.message)
  )
)

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }),
  new winston.transports.File({ filename: 'logs/combine.log' })
]

const Logger = winston.createLogger({
  level: 'debug',
  levels,
  format,
  defaultMeta: { service: 'user-service' },
  transports
})

export default Logger
