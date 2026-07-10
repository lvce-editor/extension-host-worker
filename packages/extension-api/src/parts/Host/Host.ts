import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export const confirm = async (message: string): Promise<boolean> => {
  return Boolean(await executeCommand('ConfirmPrompt.prompt', message))
}

export const getWorkspaceFolder = async (): Promise<string> => {
  return (await executeCommand('Workspace.getPath')) as string
}

export const handleWorkspaceRefresh = async (): Promise<void> => {
  await executeCommand('Layout.handleWorkspaceRefresh')
}

export const openUri = async (uri: string): Promise<void> => {
  await executeCommand('Main.openUri', uri)
}
