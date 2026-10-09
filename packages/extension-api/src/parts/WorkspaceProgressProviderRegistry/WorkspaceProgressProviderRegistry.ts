import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import type { WorkspaceProgressData, WorkspaceProgressStatus } from '../WorkspaceProgressData/WorkspaceProgressData.ts'
import type { WorkspaceProgressProvider } from '../WorkspaceProgressProvider/WorkspaceProgressProvider.ts'
import type { WorkspaceProgressProviderHandle } from '../WorkspaceProgressProviderHandle/WorkspaceProgressProviderHandle.ts'

const providers: Record<string, WorkspaceProgressProvider> = Object.create(null)
const validStatuses = new Set<WorkspaceProgressStatus>(['idle', 'in-progress', 'finished', 'error'])

const validateProgressData = (value: unknown): WorkspaceProgressData => {
  if (!value || typeof value !== 'object') {
    throw new TypeError('Workspace progress data must be an object')
  }
  const data = value as Record<string, unknown>
  if (typeof data.status !== 'string' || !validStatuses.has(data.status as WorkspaceProgressStatus)) {
    throw new TypeError('Workspace progress status must be idle, in-progress, finished, or error')
  }
  if (typeof data.message !== 'string') {
    throw new TypeError('Workspace progress message must be a string')
  }
  return { message: data.message, status: data.status as WorkspaceProgressStatus }
}

export const getWorkspaceProgressData = async (): Promise<WorkspaceProgressData[]> => {
  const result: WorkspaceProgressData[] = []
  for (const provider of Object.values(providers)) {
    try {
      result.push(validateProgressData(await provider.getProgressData()))
    } catch (error) {
      console.error(`Failed to read workspace progress provider ${provider.id}`, error)
    }
  }
  return result
}

const notifyChange = async (operationId?: number): Promise<void> => {
  await ExtensionManagementWorker.invoke('WorkspaceProgress.handleChange', operationId)
}

export const registerWorkspaceProgressProvider = (provider: WorkspaceProgressProvider): WorkspaceProgressProviderHandle => {
  if (!provider || typeof provider.id !== 'string' || !provider.id) {
    throw new TypeError('Workspace progress provider is missing id')
  }
  if (typeof provider.getProgressData !== 'function') {
    throw new TypeError(`Workspace progress provider ${provider.id} is missing getProgressData`)
  }
  if (provider.id in providers) {
    throw new TypeError(`Workspace progress provider ${provider.id} is already registered`)
  }
  providers[provider.id] = provider
  void notifyChange().catch(() => {})
  return {
    async dispose(): Promise<void> {
      delete providers[provider.id]
      try {
        await notifyChange()
      } catch {
        // Extension shutdown must not depend on a live renderer.
      }
    },
    refresh: (operationId?: number) => notifyChange(operationId),
  }
}

export const resetWorkspaceProgressProviderRegistry = (): void => {
  for (const id of Object.keys(providers)) {
    delete providers[id]
  }
}
