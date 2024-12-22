import * as HandleError from '../HandleError/HandleError.ts'

/**
 * @param {PromiseRejectionEvent} event
 */
export const handleUnhandledRejection = async (event) => {
  try {
    event.preventDefault()
    await HandleError.handleError(event.reason)
  } catch {
    console.error(event.reason)
  }
}
