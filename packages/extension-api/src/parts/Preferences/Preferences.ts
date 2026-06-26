import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const getPreference = async (key: string): Promise<unknown> => {
  return ExtensionManagementWorker.invoke('Extensions.getPreference', key)
}

export const setPreference = async (key: string, value: unknown): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.setPreference', key, value)
}
