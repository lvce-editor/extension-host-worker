import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export const getPreference = async (key: string): Promise<unknown> => {
  return ExtensionManagementWorker.invoke('Extensions.getPreference', key)
}

export const openSettings = async (): Promise<void> => {
  await executeCommand('Preferences.openSettingsUi')
}

export const setPreference = async (key: string, value: unknown): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.setPreference', key, value)
}
