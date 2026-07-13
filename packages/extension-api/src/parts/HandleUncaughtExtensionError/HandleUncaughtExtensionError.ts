import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as SerializeError from '../SerializeError/SerializeError.ts'

export const handleUncaughtExtensionError = async (error: unknown): Promise<void> => {
  const serializedError = SerializeError.serializeError(error)
  await ExtensionManagementWorker.invoke('Extensions.handleUncaughtExtensionError', serializedError)
}
