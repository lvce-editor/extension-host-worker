import * as PrettyError from '../PrettyError/PrettyError.ts'

const state = {
  /**
   * @type {string[]}
   */
  seenWarnings: [],
}

export const logError = async (error) => {
  const prettyError = await PrettyError.prepare(error)
  const prettyErrorString = PrettyError.print(prettyError)
  console.error(prettyErrorString)
  return prettyError
}

const handleError = async (error) => {
  try {
    await logError(error)
  } catch (otherError) {
    console.warn('ErrorHandling error')
    console.warn(otherError)
    console.error(error)
  }
}

/**
 * @param {PromiseRejectionEvent} event
 */
export const handleUnhandledRejection = async (event) => {
  try {
    event.preventDefault()
    await handleError(event.reason)
  } catch {
    console.error(event.reason)
  }
}

/**
 * @param {ErrorEvent} event
 */
export const handleUnhandledError = async (event) => {
  try {
    event.preventDefault()
    await handleError(event.error)
  } catch {
    console.error(event.error)
  }
}
