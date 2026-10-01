import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export interface GetAccessTokenOptions {
  // Use always after a server authentication rejection, even before local expiry.
  readonly refresh?: 'if-needed' | 'always'
}

export const getAccessToken = (options: GetAccessTokenOptions = {}): Promise<string> => {
  return ExtensionManagementWorker.invoke('Extensions.getAccessToken', options)
}
