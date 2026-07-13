import * as HandleUncaughtExtensionError from '../HandleUncaughtExtensionError/HandleUncaughtExtensionError.ts'

const getError = (event: ErrorEvent): unknown => {
  if (event.error) {
    return event.error
  }
  return {
    constructor: {
      name: 'Error',
    },
    message: event.message,
    stack: `${event.message}\n    at ${event.filename}:${event.lineno}:${event.colno}`,
  }
}

export const handleUnhandledError = async (event: ErrorEvent): Promise<void> => {
  event.preventDefault()
  const error = getError(event)
  try {
    await HandleUncaughtExtensionError.handleUncaughtExtensionError(error)
  } catch {
    console.error(error)
  }
}
