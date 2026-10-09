import type { WorkspaceProgressData } from '../WorkspaceProgressData/WorkspaceProgressData.ts'

export interface WorkspaceProgressProvider {
  readonly getProgressData: () => WorkspaceProgressData | Promise<WorkspaceProgressData>
  readonly id: string
}
