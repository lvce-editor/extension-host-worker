import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'
import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.ts'

export const getRemoteUrlForWebView = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
  return await ExtensionManagementWorker.invoke('Extensions.getRemoteUrlForWebView', uri, options)
}
