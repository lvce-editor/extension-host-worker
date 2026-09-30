import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export interface PrettyError {
  readonly codeFrame?: string
  readonly message?: string
  readonly name?: string
  readonly stack?: string
}

interface ErrorLike {
  readonly codeFrame?: string
  readonly code?: string
  readonly constructor?: { readonly name?: string }
  readonly errorMessage?: string
  readonly errorStack?: string
  readonly message?: string
  readonly name?: string
  readonly stack?: string
}

const serializeError = (error: unknown): ErrorLike => {
  if (error instanceof Error) {
    return {
      codeFrame: (error as Error & { codeFrame?: string }).codeFrame,
      code: (error as Error & { code?: string }).code,
      constructor: { name: error.constructor.name },
      message: error.message,
      name: error.name,
      stack: error.stack,
    }
  }
  if (error && typeof error === 'object') {
    const value = error as ErrorLike
    const constructorName = Object.hasOwn(value, 'constructor') ? value.constructor?.name : undefined
    return {
      codeFrame: value.codeFrame,
      code: value.code,
      constructor: constructorName ? { name: constructorName } : undefined,
      message: value.message || value.errorMessage,
      name: value.name || constructorName,
      stack: value.stack || value.errorStack,
    }
  }
  return { message: String(error) }
}

export const preparePrettyError = async (error: unknown): Promise<PrettyError> => {
  const serialized = serializeError(error)
  try {
    return (await executeCommand('ErrorHandling.preparePrettyError', serialized)) as PrettyError
  } catch {
    return serialized
  }
}
