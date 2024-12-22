export const setStackTraceLimit = (errorConstructor: any, value: number): void => {
  if (errorConstructor.stackTraceLimit && errorConstructor.stackTraceLimit < value) {
    errorConstructor.stackTraceLimit = value
  }
}
