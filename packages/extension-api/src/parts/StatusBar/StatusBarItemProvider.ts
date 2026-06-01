import type { StatusBarItem } from './StatusBarItem.ts'

export interface StatusBarItemProvider {
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}
