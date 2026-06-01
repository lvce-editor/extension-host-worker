import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface RegisteredStatusBarItemProvider {
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}
