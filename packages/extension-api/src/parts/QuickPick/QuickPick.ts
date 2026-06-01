import * as Rpc from '../Rpc/Rpc.ts'

export interface QuickPickItem {
  readonly description: string
  readonly label: string
  readonly value: unknown
}

export interface ShowQuickPickOptions {
  readonly items: readonly QuickPickItem[]
  readonly placeholder?: string
}

export const showQuickPick = async (options: ShowQuickPickOptions): Promise<unknown> => {
  return Rpc.invoke('ExtensionHostQuickPick.showQuickPick', options)
}
