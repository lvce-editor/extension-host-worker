import type { StatusBarItem } from '../StatusBarItem/StatusBarItem.ts'

export interface StatusBarItemContextMenuItem {
  readonly args?: readonly unknown[]
  readonly command: string
  readonly id: string
  readonly label: string
}

export interface StatusBarItemProvider {
  readonly getContextMenuItems?: () => readonly StatusBarItemContextMenuItem[]
  readonly getStatusBarItem: () => StatusBarItem | undefined
  readonly id: string
}
