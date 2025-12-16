import * as ExtensionManagementWorker from '../ExtensionManagementWorker/ExtensionManagementWorker.ts'

export const addWebExtension = async (path: string): Promise<any> => {
  const manifest = await ExtensionManagementWorker.invoke('Extensions.addWebExtension', path)
  return manifest
}
