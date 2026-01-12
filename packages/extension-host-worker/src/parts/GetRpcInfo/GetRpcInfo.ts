import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getRpcInfo = async (rpcId: string): Promise<any> => {
  return await ExtensionManagementWorker.invoke('Extensions.getRpcInfo', rpcId)
}
