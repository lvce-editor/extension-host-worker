import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export const focusNextTab = async (): Promise<void> => {
  await executeCommand('Main.focusNextTab')
}

export const focusPreviousTab = async (): Promise<void> => {
  await executeCommand('Main.focusPreviousTab')
}
