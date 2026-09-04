import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

const ScriptInputSource = 2

export interface ConfigurationDefinition {
  readonly default?: unknown
  readonly description?: string
  readonly enum?: readonly string[]
  readonly maximum?: number
  readonly minimum?: number
  readonly type?: string
}

interface ExtensionManifest {
  readonly configuration?: Readonly<Record<string, ConfigurationDefinition>>
  readonly disabled?: boolean
}

const getConfigurationEntries = (extension: ExtensionManifest): readonly (readonly [string, ConfigurationDefinition])[] => {
  if (extension.disabled || !extension.configuration || typeof extension.configuration !== 'object') {
    return []
  }
  return Object.entries(extension.configuration)
}

export const getConfigurationDefinitions = async (): Promise<Readonly<Record<string, ConfigurationDefinition>>> => {
  const platform = (await executeCommand('Layout.getPlatform')) as number
  const extensions = (await ExtensionManagementWorker.invoke('Extensions.getAllExtensions', '', platform)) as readonly ExtensionManifest[]
  return Object.fromEntries(extensions.flatMap(getConfigurationEntries))
}

export const getPreference = async (key: string): Promise<unknown> => {
  return ExtensionManagementWorker.invoke('Extensions.getPreference', key)
}

export const openSettings = async (): Promise<void> => {
  await executeCommand('Preferences.openSettingsUi')
}

export const setSettingsSearchValue = async (value: string): Promise<void> => {
  await executeCommand('Settings.handleInput', value, ScriptInputSource)
}

export const setPreference = async (key: string, value: unknown): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.setPreference', key, value)
}
