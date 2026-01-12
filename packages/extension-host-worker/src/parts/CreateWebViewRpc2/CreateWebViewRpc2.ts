import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const createWebViewWorkerRpc2 = async (rpcInfo: any, port: MessagePort): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer('Extensions.createWebViewWorkerRpc2', rpcInfo, port)
}
