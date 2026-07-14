import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getAccessToken = (): Promise<string> => {
  return ExtensionManagementWorker.invoke('Extensions.getAccessToken')
}
