import * as WorkspaceProgressProviderRegistry from '../WorkspaceProgressProviderRegistry/WorkspaceProgressProviderRegistry.ts'

const getStatusBarItems = (): readonly never[] => {
  return []
}

export const commandMap = {
  'ExtensionApi.getStatusBarItems': getStatusBarItems,
  'ExtensionApi.getWorkspaceProgressData': WorkspaceProgressProviderRegistry.getWorkspaceProgressData,
}
