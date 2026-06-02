import { MessagePortRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  await MessagePortRpcClient.create({
    commandMap: CommandMap.commandMap,
    messagePort: port,
  })
}
