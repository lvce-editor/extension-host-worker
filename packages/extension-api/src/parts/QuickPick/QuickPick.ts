import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { ShowQuickInputOptions } from '../ShowQuickInputOptions/ShowQuickInputOptions.ts'
import type { ShowQuickPickOptions } from '../ShowQuickPickOptions/ShowQuickPickOptions.ts'
import { executeCommand } from '../ExecuteCommand/ExecuteCommand.ts'

/** Opens the color picker in the specified editor, optionally starting with a color value. */
export const openColorPicker = async (editorId: number, initialColor?: string): Promise<void> => {
  if (!Number.isSafeInteger(editorId) || editorId < 0) {
    throw new TypeError('editorId must be a non-negative integer')
  }
  if (initialColor !== undefined && typeof initialColor !== 'string') {
    throw new TypeError('initialColor must be a string')
  }
  await executeCommand('GetActiveEditor.openColorPicker', editorId, initialColor)
}
export const showFileQuickPick = async (): Promise<void> => {
  await executeCommand('QuickPick.showFile')
}

/** Shows a freeform text field without a results list. Returns undefined on cancellation. */
export const showQuickInput = async (options: ShowQuickInputOptions = {}): Promise<string | undefined> => {
  return ExtensionManagementWorker.invoke('ExtensionHostQuickPick.showQuickInput', options) as Promise<string | undefined>
}

export const showQuickPick = async (options: ShowQuickPickOptions): Promise<unknown> => {
  return ExtensionManagementWorker.invoke('ExtensionHostQuickPick.showQuickPick', options)
}
