import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export type NotificationType = 'error' | 'info' | 'warning'

export interface ConfirmOptions {
  readonly cancelMessage?: string
  readonly confirmMessage?: string
  readonly title?: string
}

export interface ShowErrorMessageOptions {
  readonly confirmMessage?: string
  readonly title?: string
}

export const closeUri = async (uri: string): Promise<void> => {
  await executeCommand('Main.closeTabsByUris', [uri])
}

export const confirm = async (message: string, options?: ConfirmOptions): Promise<boolean> => {
  return Boolean(await executeCommand('ConfirmPrompt.prompt', message, ...(options ? [options] : [])))
}

export const showErrorMessage = async (message: string, options: ShowErrorMessageOptions = {}): Promise<void> => {
  await executeCommand('ConfirmPrompt.showErrorMessage', { ...options, message })
}

export const getWorkspaceFolder = async (): Promise<string> => {
  return (await executeCommand('Workspace.getPath')) as string
}

export const getRecentlyOpenedWorkspaceUris = async (): Promise<readonly string[]> => {
  return (await executeCommand('RecentlyOpened.getRecentlyOpened')) as readonly string[]
}

export const getWorkspaceUri = async (): Promise<string> => {
  return (await executeCommand('Workspace.getUri')) as string
}

export const handleWorkspaceRefresh = async (changes?: { readonly reloadAll?: boolean }): Promise<void> => {
  await executeCommand('Layout.handleWorkspaceRefresh', ...(changes ? [changes] : []))
}

export const openUri = async (uri: string): Promise<void> => {
  await executeCommand('Main.openUri', uri)
}

export const showNotification = async (type: NotificationType, message: string): Promise<void> => {
  await ExtensionManagementWorker.invoke('Extensions.showNotification', type, message)
}

export const setWorkspaceUri = async (uri: string): Promise<void> => {
  await executeCommand('Workspace.setUri', uri)
}
