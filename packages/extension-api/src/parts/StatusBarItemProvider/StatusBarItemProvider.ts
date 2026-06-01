import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface StatusBarItemProvider {
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}
