import { TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import * as RendererWorker from '../Rpc/Rpc.ts'

const send = async (port: MessagePort) => {
  const initialCommand = 'FileSystem.handleMessagePort'
  await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker', port, initialCommand)
}

export const launchFileSystemProcess = async () => {
  const rpc = await TransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  return rpc
}
