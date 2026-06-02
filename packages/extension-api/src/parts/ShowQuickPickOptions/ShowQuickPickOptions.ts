import type { QuickPickItem } from '../QuickPickItem/QuickPickItem.ts'

export interface ShowQuickPickOptions {
  readonly items: readonly QuickPickItem[]
  readonly placeholder?: string
}
