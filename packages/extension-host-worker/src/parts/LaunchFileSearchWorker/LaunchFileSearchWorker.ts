import type { Rpc } from '@lvce-editor/rpc'
import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const launchFileSearchWorker = async (): Promise<Rpc> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    async send(port) {
      // @ts-ignore
      await RendererWorker.sendMessagePortToFileSearchWorker(port, 0)
    },
  })
  return rpc
}
