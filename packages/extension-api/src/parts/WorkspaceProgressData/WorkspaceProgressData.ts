/**
 * `idle` restores the workspace operation's initial message. `in-progress` and
 * `finished` display `message`; `error` displays it with an error prefix.
 */
export type WorkspaceProgressStatus = 'idle' | 'in-progress' | 'finished' | 'error'

export interface WorkspaceProgressData {
  /** Text displayed in the workspace progress surface. */
  readonly message: string
  /** Current state of the extension's workspace setup operation. */
  readonly status: WorkspaceProgressStatus
}
