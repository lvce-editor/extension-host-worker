import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'
import type { StatusBarItemContextMenuItem } from '../StatusBarItemProvider/StatusBarItemProvider.ts'

export interface RegisteredStatusBarItemProvider {
  readonly getContextMenuItems?: () => readonly StatusBarItemContextMenuItem[]
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}
