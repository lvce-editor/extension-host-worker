import { type Rpc, WebWorkerRpcClient } from '@lvce-editor/rpc'
import * as ExtensionApiWorkerCommandMap from '../ExtensionApiWorkerCommandMap/ExtensionApiWorkerCommandMap.ts'
import * as HandleUnhandledError from '../HandleUnhandledError/HandleUnhandledError.ts'
import * as HandleUnhandledRejection from '../HandleUnhandledRejection/HandleUnhandledRejection.ts'

export const listen = async (): Promise<Rpc> => {
  globalThis.addEventListener('error', HandleUnhandledError.handleUnhandledError)
  globalThis.addEventListener('unhandledrejection', HandleUnhandledRejection.handleUnhandledRejection)
  const rpc = WebWorkerRpcClient.create({
    commandMap: ExtensionApiWorkerCommandMap.commandMap,
  })
  return rpc
}
