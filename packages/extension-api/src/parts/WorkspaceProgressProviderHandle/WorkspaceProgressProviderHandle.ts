import type { Disposable } from '../Disposable/Disposable.ts'

export interface WorkspaceProgressProviderHandle extends Disposable {
  dispose(): Promise<void>
  /** Notify the host that progress changed for a Workspace.startProgress id. */
  refresh(operationId?: number): Promise<void>
}
