import { listen } from '../ExtensionApiWorkerListen/ExtensionApiWorkerListen.ts'
import * as Rpc from '../Rpc/Rpc.ts'

let rpcPromise: Promise<Awaited<ReturnType<typeof listen>>> | undefined

export const activate = async (): Promise<void> => {
  if (!rpcPromise) {
    rpcPromise = listen()
  }
  const rpc = await rpcPromise
  Rpc.set(rpc)
}
