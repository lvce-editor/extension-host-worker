import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export const refreshEditorGutterDecorations = async (): Promise<void> => {
  await executeCommand('Editor.refreshGutterDecorationsAll')
}
