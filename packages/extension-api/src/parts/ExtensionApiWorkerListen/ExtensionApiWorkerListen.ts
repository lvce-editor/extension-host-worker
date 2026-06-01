import { WebWorkerRpcClient, type Rpc } from '@lvce-editor/rpc'
import * as ExtensionApiWorkerCommandMap from '../ExtensionApiWorkerCommandMap/ExtensionApiWorkerCommandMap.ts'

let rpcPromise: Promise<Rpc> | undefined

export const listen = async (): Promise<Rpc> => {
  rpcPromise ||= WebWorkerRpcClient.create({
    commandMap: ExtensionApiWorkerCommandMap.commandMap,
  })
  return rpcPromise
}
