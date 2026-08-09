import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export const openProcessExplorer = async (): Promise<void> => {
  await executeCommand('Developer.openProcessExplorer')
}
