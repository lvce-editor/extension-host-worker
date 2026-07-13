export interface SerializedError {
  readonly code?: unknown
  readonly codeFrame?: unknown
  readonly constructor: {
    readonly name: string
  }
  readonly message?: unknown
  readonly name?: unknown
  readonly stack?: unknown
}

const getConstructorName = (error: Record<string, any>): string => {
  return error.constructor?.name || 'Error'
}

export const serializeError = (error: unknown): SerializedError | unknown => {
  if (!error || (typeof error !== 'object' && typeof error !== 'function')) {
    return error
  }
  const value = error as Record<string, any>
  return {
    code: value.code,
    codeFrame: value.codeFrame,
    constructor: {
      name: getConstructorName(value),
    },
    message: value.message,
    name: value.name,
    stack: value.stack,
  }
}
