import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { ShowQuickPickOptions } from '../ShowQuickPickOptions/ShowQuickPickOptions.ts'

export const showQuickPick = async (options: ShowQuickPickOptions): Promise<unknown> => {
  return ExtensionManagementWorker.invoke('ExtensionHostQuickPick.showQuickPick', options)
}
