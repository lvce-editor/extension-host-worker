import { type Rpc, WebWorkerRpcClient2 } from '@lvce-editor/rpc'
import * as ExtensionApiWorkerCommandMap from '../ExtensionApiWorkerCommandMap/ExtensionApiWorkerCommandMap.ts'

export const listen = async (): Promise<Rpc> => {
  const rpc = WebWorkerRpcClient2.create({
    commandMap: ExtensionApiWorkerCommandMap.commandMap,
  })
  return rpc
}
