import { listen } from '../ExtensionApiWorkerListen/ExtensionApiWorkerListen.ts'

let activated = false

export const activate = async (): Promise<void> => {
  if (activated) {
    throw new Error('Extension API Worker already activated')
  }
  activated = true
  await listen()
}
