import type { Diagnostic } from '../DiagnosticResult/DiagnosticResult.ts'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export const formatDocument = async (): Promise<void> => {
  await executeCommand('Editor.format')
}

export const getDiagnostics = async (): Promise<readonly Diagnostic[]> => {
  return (await executeCommand('GetActiveEditor.getDiagnostics')) as readonly Diagnostic[]
}

export const showCompletions = async (): Promise<void> => {
  await executeCommand('Editor.openCompletion')
}
