import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { QuickPickWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostQuickPick from '../ExtensionHostQuickPick/ExtensionHostQuickPick.ts'

export const launchQuickPickWorker = async (): Promise<void> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {
      'ExtensionHostQuickPick.renderQuickInput': ExtensionHostQuickPick.renderQuickInput,
    },
    async send(port) {
      await RendererWorker.sendMessagePortToQuickPickWorker(port, 0)
    },
  })
  QuickPickWorker.set(rpc)
}
