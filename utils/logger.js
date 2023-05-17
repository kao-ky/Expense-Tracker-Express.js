const winston = require('winston')

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
}

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevMode = env === 'development'
    return isDevMode ? 'debug' : 'info'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'white',
    debug: 'green'
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format(info => ({ ...info, level: info.level.toUpperCase() }))(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level} > ${info.message}`
    )
)

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error'
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
})

module.exports = logger