import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { QuickPickWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const launchQuickPickWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: CommandMap.commandMap,
    async send(port) {
      await RendererWorker.sendMessagePortToQuickPickWorker(port, 0)
    },
  })
  QuickPickWorker.set(rpc)
}
