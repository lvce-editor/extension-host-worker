import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { FileSearchWorker, RendererWorker } from '@lvce-editor/rpc-registry'

export const launchFileSearchWorker = async (): Promise<void> => {
  try {
    const rpc = await LazyTransferMessagePortRpcParent.create({
      commandMap: {},
      async send(port) {
        await RendererWorker.sendMessagePortToFileSearchWorker(port, 0)
      },
    })
    FileSearchWorker.set(rpc)
  } catch {
    // ignore
  }
}
