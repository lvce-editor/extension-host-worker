import { listen } from '../ExtensionApiWorkerListen/ExtensionApiWorkerListen.ts'
import * as Rpc from '../Rpc/Rpc.ts'

let activated = false

export const activate = async (): Promise<void> => {
  if (activated) {
    throw new Error('Extension API Worker already activated')
  }
  activated = true
  const rpc = await listen()
  Rpc.set(rpc)
}
