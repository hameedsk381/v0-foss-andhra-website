import pino from 'pino'

const isDevelopment = process.env.NODE_ENV !== 'production'

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  base: {
    env: process.env.NODE_ENV || 'development',
  },
})

// Helper functions for structured logging
export const logError = (error: Error, context?: Record<string, any>) => {
  logger.error({
    err: error,
    message: error.message,
    stack: error.stack,
    ...context,
  })
}

export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info({ message, ...context })
}

export const logWarning = (message: string, context?: Record<string, any>) => {
  logger.warn({ message, ...context })
}

export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug({ message, ...context })
}
