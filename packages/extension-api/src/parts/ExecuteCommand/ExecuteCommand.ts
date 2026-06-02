import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export const executeCommand = async (id: string, ...args: readonly unknown[]): Promise<unknown> => {
  return ExtensionManagementWorker.invoke('Extensions.executeCommand', id, ...args)
}
