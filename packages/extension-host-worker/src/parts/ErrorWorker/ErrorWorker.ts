import { TransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const send = async (port: MessagePort): Promise<void> => {
  const command = 'Errors.handleMessagePort'

  // @ts-ignore

  await RendererWorker.invokeAndTransfer('SendMessagePortToExtensionHostWorker.sendMessagePortToErrorWorker', port, command)
}

export const getImportError = async (url: string, error: any): Promise<any> => {
  const rpc = await TransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  })
  const result = await rpc.invoke('Errors.tryToGetActualImportErrorMessage', url, error)
  return result
}
