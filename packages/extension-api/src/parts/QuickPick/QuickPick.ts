import type { ShowQuickPickOptions } from '../ShowQuickPickOptions/ShowQuickPickOptions.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const showQuickPick = async (options: ShowQuickPickOptions): Promise<unknown> => {
  return Rpc.invoke('ExtensionHostQuickPick.showQuickPick', options)
}
