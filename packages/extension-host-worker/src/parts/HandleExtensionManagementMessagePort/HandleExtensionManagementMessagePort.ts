import { MessagePortRpcClient } from '@lvce-editor/rpc'
import { handleExtensionManagementMessagePort as handleExtensionManagementMessagePortBase } from '../../../../extension-api/src/parts/HandleExtensionManagementMessagePort/HandleExtensionManagementMessagePort.ts'
import * as CommandMap from '../CommandMap/CommandMap.ts'

export const handleExtensionManagementMessagePort = async (port: MessagePort): Promise<void> => {
  await handleExtensionManagementMessagePortBase({
    commandMap: CommandMap.commandMap,
    createMessagePortRpcClient: MessagePortRpcClient.create,
    port,
  })
}
