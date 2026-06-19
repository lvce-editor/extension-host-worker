import * as RendererWorker from '../Rpc/Rpc.ts'

export const sendMessagePortToFileSystemWorker = async (port: MessagePort): Promise<void> => {
  await RendererWorker.invokeAndTransfer(
    'SendMessagePortToExtensionHostWorker.sendMessagePortToFileSystemWorker',
    port,
    'FileSystem.handleMessagePort',
  )
}
