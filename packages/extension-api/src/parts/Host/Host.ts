import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'
import { getFileSystemProviderPathSeparator } from '../FileSystemProviderRegistry/FileSystemProviderRegistry.ts'

export type NotificationType = 'error' | 'info' | 'warning'

export const closeUri = async (uri: string): Promise<void> => {
  await executeCommand('Main.closeTabsByUris', [uri])
}

export const confirm = async (message: string): Promise<boolean> => {
  return Boolean(await executeCommand('ConfirmPrompt.prompt', message))
}

export const getWorkspaceFolder = async (): Promise<string> => {
  return (await executeCommand('Workspace.getPath')) as string
}

export const getWorkspaceUri = async (): Promise<string> => {
  return (await executeCommand('Workspace.getUri')) as string
}

export const handleWorkspaceRefresh = async (): Promise<void> => {
  await executeCommand('Layout.handleWorkspaceRefresh')
}

export const openUri = async (uri: string): Promise<void> => {
  await executeCommand('Main.openUri', uri)
}

export const showNotification = async (type: NotificationType, message: string): Promise<void> => {
  await executeCommand('Notification.create', type, message)
}

export const setWorkspaceUri = async (uri: string): Promise<void> => {
  const protocolEnd = uri.indexOf(':')
  const protocol = protocolEnd === -1 ? '' : uri.slice(0, protocolEnd)
  const pathSeparator = getFileSystemProviderPathSeparator(protocol)
  if (pathSeparator === undefined) {
    await executeCommand('Workspace.setUri', uri)
    return
  }
  await executeCommand('Workspace.setUri', uri, pathSeparator)
}
