import type { Diagnostic } from '../DiagnosticResult/DiagnosticResult.ts'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

export interface EditorSelection {
  readonly endColumnIndex: number
  readonly endRowIndex: number
  readonly startColumnIndex: number
  readonly startRowIndex: number
}

export const formatDocument = async (): Promise<void> => {
  await executeCommand('Editor.format')
}

export const getDiagnostics = async (): Promise<readonly Diagnostic[]> => {
  return (await executeCommand('GetActiveEditor.getDiagnostics')) as readonly Diagnostic[]
}

export const getEditorSelections = async (): Promise<readonly EditorSelection[]> => {
  const values = (await executeCommand('GetActiveEditor.getSelections')) as readonly number[]
  const selections: EditorSelection[] = []
  for (let index = 0; index < values.length; index += 4) {
    selections.push({
      endColumnIndex: values[index + 3],
      endRowIndex: values[index + 2],
      startColumnIndex: values[index + 1],
      startRowIndex: values[index],
    })
  }
  return selections
}

export const setEditorSelections = async (selections: readonly EditorSelection[]): Promise<void> => {
  const values = selections.flatMap(({ endColumnIndex, endRowIndex, startColumnIndex, startRowIndex }) => [
    startRowIndex,
    startColumnIndex,
    endRowIndex,
    endColumnIndex,
  ])
  await executeCommand('GetActiveEditor.setSelections', values)
}

export const showCompletions = async (): Promise<void> => {
  await executeCommand('Editor.openCompletion')
}

export interface ActiveEditor {
  readonly id: number
  readonly uri: string
}

/** Returns the active editor in this application, or undefined if there is none. */
export const getActiveEditor = async (): Promise<ActiveEditor | undefined> => {
  const editor = (await executeCommand('GetActiveEditor.getActiveEditorInfo')) as ActiveEditor | null | undefined
  return editor ?? undefined
}
