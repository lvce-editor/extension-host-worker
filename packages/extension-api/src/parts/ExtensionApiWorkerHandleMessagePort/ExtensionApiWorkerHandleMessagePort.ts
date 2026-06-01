import { MessagePortRpcClient } from '@lvce-editor/rpc'
import * as ExtensionApiWorkerCommandMap from '../ExtensionApiWorkerCommandMap/ExtensionApiWorkerCommandMap.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  await MessagePortRpcClient.create({
    commandMap: ExtensionApiWorkerCommandMap.commandMap,
    messagePort: port,
  })
}
