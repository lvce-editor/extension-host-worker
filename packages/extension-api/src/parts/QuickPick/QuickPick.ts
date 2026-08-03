import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { ShowQuickInputOptions } from '../ShowQuickInputOptions/ShowQuickInputOptions.ts'
import type { ShowQuickPickOptions } from '../ShowQuickPickOptions/ShowQuickPickOptions.ts'

export const showQuickInput = async (options: ShowQuickInputOptions = {}): Promise<string | undefined> => {
  return ExtensionManagementWorker.invoke('ExtensionHostQuickPick.showQuickInput', options) as Promise<string | undefined>
}

export const showQuickPick = async (options: ShowQuickPickOptions): Promise<unknown> => {
  return ExtensionManagementWorker.invoke('ExtensionHostQuickPick.showQuickPick', options)
}
