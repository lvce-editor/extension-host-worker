import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

let cacheWorkerPromise: Promise<Rpc> | undefined

const send = async (port: MessagePort): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer('Extensions.sendMessagePortToCacheWorker', port)
}

export const initializeCacheWorker = async (): Promise<Rpc> => {
  if (cacheWorkerPromise) {
    return cacheWorkerPromise
  }
  cacheWorkerPromise = LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  }).catch((error) => {
    cacheWorkerPromise = undefined
    throw error
  })
  return cacheWorkerPromise
}

export const disposeCacheWorker = async (): Promise<void> => {
  const rpcPromise = cacheWorkerPromise
  cacheWorkerPromise = undefined
  if (rpcPromise) {
    const rpc = await rpcPromise
    await rpc.dispose()
  }
}
