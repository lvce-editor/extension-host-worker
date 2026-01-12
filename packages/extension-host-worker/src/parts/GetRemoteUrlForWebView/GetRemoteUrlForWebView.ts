import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { GetRemoteUrlOptions } from '../ExtensionHostRemoteUrlOptions/ExtensionHostRemoteUrlOptions.ts'

export const getRemoteUrlForWebView = async (uri: string, options: GetRemoteUrlOptions = {}): Promise<string> => {
  return await ExtensionManagementWorker.invoke('Extensions.getRemoteUrlForWebView', uri, options)
}
