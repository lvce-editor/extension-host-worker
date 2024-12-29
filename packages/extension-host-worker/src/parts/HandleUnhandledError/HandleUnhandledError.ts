import * as HandleError from '../HandleError/HandleError.ts'

/**
 * @param {ErrorEvent} event
 */
export const handleUnhandledError = async (event) => {
  try {
    event.preventDefault()
    await HandleError.handleError(event.error)
  } catch {
    console.error(event.error)
  }
}
