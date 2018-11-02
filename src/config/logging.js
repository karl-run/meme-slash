const { createLogger, format, transports } = require('winston')

const logFormat = format.printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`
})

const logger = createLogger({
  level: 'debug',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.label({ label: `¯\\_(ツ)_/¯` }),
    logFormat,
  ),
  transports: [new transports.Console()],
})

global.log = logger
