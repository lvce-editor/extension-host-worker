import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { ShowDialogOptions } from '../ShowDialogOptions/ShowDialogOptions.ts'

export const showDialog = async (options: ShowDialogOptions): Promise<void> => {
  await ExtensionManagementWorker.invoke('ExtensionHostDialog.showDialog', options)
}
