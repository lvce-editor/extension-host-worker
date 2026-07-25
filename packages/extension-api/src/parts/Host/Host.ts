import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export type NotificationType = 'error' | 'info' | 'warning'

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
