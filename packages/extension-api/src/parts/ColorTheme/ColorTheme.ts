import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

interface ColorThemeContribution {
  readonly id: string
}

interface ExtensionManifest {
  readonly colorThemes?: readonly ColorThemeContribution[]
  readonly disabled?: boolean
}

const getColorThemeIds = (extension: ExtensionManifest): readonly string[] => {
  if (extension.disabled || !Array.isArray(extension.colorThemes)) {
    return []
  }
  return extension.colorThemes.map((colorTheme) => colorTheme.id)
}

export const getColorThemeNames = async (): Promise<readonly string[]> => {
  const platform = (await executeCommand('Layout.getPlatform')) as number
  const extensions = (await ExtensionManagementWorker.invoke('Extensions.getAllExtensions', '', platform)) as readonly ExtensionManifest[]
  return extensions.flatMap(getColorThemeIds)
}
