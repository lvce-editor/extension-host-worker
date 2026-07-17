import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostCommand from '../ExtensionHostCommand/ExtensionHostCommand.ts'

const isCommandNotFoundError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'CommandNotFoundError'
}

export const executeCommand = async (id: string, ...args: readonly unknown[]): Promise<unknown> => {
  try {
    return await ExtensionManagementWorker.invoke('Extensions.executeCommand', id, ...args)
  } catch (error) {
    if (!isCommandNotFoundError(error)) {
      throw error
    }
    if (ExtensionHostCommand.hasCommand(id)) {
      return ExtensionHostCommand.executeCommand(id, ...args)
    }
    return RendererWorker.invoke(id, ...args)
  }
}
