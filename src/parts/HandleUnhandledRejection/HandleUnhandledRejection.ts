import * as ProcessName from '../ProcessName/ProcessName.ts'

const getOutput = (error: any) => {
  const errorMessage = error && error.message ? error.message : String(error)
  const prefix = `[${ProcessName.processName}] Unhandled Rejection: ${errorMessage}`
  if (error && error.stack) {
    return `${prefix}\n${error.stack}`
  }
  return prefix
}

export const handleUnhandledRejection = (error: any) => {
  const output = getOutput(error)
  console.error(output)
}
