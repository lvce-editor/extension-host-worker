import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.ts'

export const getRpcInfo = async (rpcId: string): Promise<any> => {
  return await ExtensionManagementWorker.invoke('Extensions.getRpcInfo', rpcId)
}
