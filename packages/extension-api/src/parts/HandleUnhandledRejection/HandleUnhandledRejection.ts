import * as HandleUncaughtExtensionError from '../HandleUncaughtExtensionError/HandleUncaughtExtensionError.ts'

export const handleUnhandledRejection = async (event: PromiseRejectionEvent): Promise<void> => {
  event.preventDefault()
  try {
    await HandleUncaughtExtensionError.handleUncaughtExtensionError(event.reason)
  } catch {
    console.error(event.reason)
  }
}
