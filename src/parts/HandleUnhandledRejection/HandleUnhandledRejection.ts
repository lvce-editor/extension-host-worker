import * as ProcessName from '../ProcessName/ProcessName.ts'

const getOutput = (error: any) => {
  const errorMessage = error && error.message ? error.message : String(error)
  const prefix = `[${ProcessName.processName}] Unhandled Rejection: ${errorMessage}`
  if (error && error.stack) {
    return `${prefix}\n${error.stack}`
  }
  return prefix
}

export const handleUnhandledRejection = (event: PromiseRejectionEvent | any) => {
  if (event instanceof PromiseRejectionEvent) {
    event.preventDefault()
    const output = getOutput(event.reason)
    console.error(output)
    return
  }
  const output = getOutput(event)
  console.error(output)
}
