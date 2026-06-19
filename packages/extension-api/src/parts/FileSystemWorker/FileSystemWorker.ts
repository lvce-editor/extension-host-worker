import { LazyTransferMessagePortRpcParent } from '@lvce-editor/rpc'
import { ExtensionManagementWorker, FileSystemWorker } from '@lvce-editor/rpc-registry'

let fileSystemWorkerPromise: Promise<void> | undefined

const send = async (port: MessagePort): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer('ExtensionApi.sendMessagePortToFileSystemWorker', port)
}

export const initializeFileSystemWorker = async (): Promise<void> => {
  if (fileSystemWorkerPromise) {
    return fileSystemWorkerPromise
  }
  fileSystemWorkerPromise = LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send,
  }).then((rpc) => {
    FileSystemWorker.set(rpc)
  })
  return fileSystemWorkerPromise
}

export const resetFileSystemWorker = (): void => {
  fileSystemWorkerPromise = undefined
}
