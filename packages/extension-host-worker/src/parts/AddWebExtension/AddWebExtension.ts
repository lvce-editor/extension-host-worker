import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const addWebExtension = async (path: string): Promise<any> => {
  const manifest = await ExtensionManagementWorker.invoke('Extensions.addWebExtension', path)
  return manifest
}
