import type { StatusBarItem } from './StatusBarItem.ts'

export interface RegisteredStatusBarItemProvider {
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}
