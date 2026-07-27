import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const deleteSecret = async (key: string): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.deleteSecret', key)
}

export const getSecret = async (key: string): Promise<string | undefined> => {
  return ExtensionManagementWorker.invoke('Extensions.getSecret', key)
}

export const storeSecret = async (key: string, value: string): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.storeSecret', key, value)
}
