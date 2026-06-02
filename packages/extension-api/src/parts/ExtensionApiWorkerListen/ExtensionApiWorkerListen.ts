import { type Rpc, WebWorkerRpcClient } from '@lvce-editor/rpc'
import * as ExtensionApiWorkerCommandMap from '../ExtensionApiWorkerCommandMap/ExtensionApiWorkerCommandMap.ts'

export const listen = async (): Promise<Rpc> => {
  const rpc = WebWorkerRpcClient.create({
    commandMap: ExtensionApiWorkerCommandMap.commandMap,
  })
  return rpc
}
