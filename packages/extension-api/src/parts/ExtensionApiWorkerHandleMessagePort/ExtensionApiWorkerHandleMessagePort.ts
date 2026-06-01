import * as ExtensionApiWorkerCommandMap from '../ExtensionApiWorkerCommandMap/ExtensionApiWorkerCommandMap.ts'
import { createJsonRpcServer } from '../JsonRpcServer/JsonRpcServer.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  createJsonRpcServer({
    commandMap: ExtensionApiWorkerCommandMap.commandMap,
    messagePort: port,
  })
}
