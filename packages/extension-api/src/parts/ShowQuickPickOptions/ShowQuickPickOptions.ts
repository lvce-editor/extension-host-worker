import type { QuickPickItem } from '../QuickPickItem/QuickPickItem.ts'

export interface ShowQuickPickOptions {
  readonly acceptInput?: boolean
  readonly items: readonly QuickPickItem[]
  readonly placeholder?: string
}
