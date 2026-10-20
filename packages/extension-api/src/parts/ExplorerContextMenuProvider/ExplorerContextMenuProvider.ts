import type { ExplorerContext } from '../ExplorerContext/ExplorerContext.ts'
import type { ExplorerContextMenuEntry } from '../ExplorerContextMenuEntry/ExplorerContextMenuEntry.ts'

export interface ExplorerContextMenuProvider {
  readonly id: string
  readonly provideMenuEntries: (context: ExplorerContext) => readonly ExplorerContextMenuEntry[] | Promise<readonly ExplorerContextMenuEntry[]>
}
