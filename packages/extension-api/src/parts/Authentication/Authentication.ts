import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export interface GetAccessTokenOptions {
  readonly refresh?: 'if-needed'
}

export const getAccessToken = (options: GetAccessTokenOptions = {}): Promise<string> => {
  return ExtensionManagementWorker.invoke('Extensions.getAccessToken', options)
}
