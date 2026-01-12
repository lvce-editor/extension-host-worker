import { WebWorkerRpcClient } from '@lvce-editor/rpc'
import * as CommandMap from '../CommandMap/CommandMap.ts'
import { launchExtensionManagementWorker } from '../LaunchExtensionManagementWorker/LaunchExtensionManagementWorker.ts'
import * as RpcId from '../RpcId/RpcId.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const listen = async (): Promise<void> => {
  const rpc1 = await launchExtensionManagementWorker()
  RpcRegistry.ExtensionManagementWorker.set(rpc1)
  const rpc = await WebWorkerRpcClient.create({
    commandMap: CommandMap.commandMap,
  })
  RpcRegistry.set(RpcId.RendererWorker, rpc)
}
