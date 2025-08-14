import { TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import * as RendererWorker from '../Rpc/Rpc.ts'

const send = async (port: MessagePort) => {
  await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port)
}

export const launchFileSystemProcess = async () => {
  const rpc = await TransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  return rpc
}
