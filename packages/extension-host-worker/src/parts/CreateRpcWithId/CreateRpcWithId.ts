import * as ExtensionHostRpcInfos from '../ExtensionHostRpcState/ExtensionHostRpcState.ts'
import * as ExtensionHostSubWorkerUrl from '../ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as RpcState from '../RpcState/RpcState.ts'

export const createRpcWithId = async (id: string, commandMap: any) => {
  const info = ExtensionHostRpcInfos.get(id)
  if (!info) {
    throw new Error(`rpc with id ${id} not found`)
  }
  const rpc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: ExtensionHostSubWorkerUrl.extensionHostSubWorkerUrl,
    name: info.name,
    commandMap,
  })
  await rpc.invoke('LoadFile.loadFile', info.url)
  RpcState.set(id, rpc)
  return rpc
}
