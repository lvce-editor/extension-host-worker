import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.ts'

/**
 * @deprecated use createWebViewWorkerRpc2 which passes the worker url as a parameter
 */
export const createWebViewWorkerRpc = async (rpcInfo: any, port: MessagePort): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer('Extensions.createWebViewWorkerRpc', rpcInfo, port)
}
