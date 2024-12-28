import * as ExtensionHostRpcState from '../ExtensionHostRpcState/ExtensionHostRpcState.ts'
import * as ExtensionHostSubWorkerUrl from '../ExtensionHostSubWorkerUrl/ExtensionHostSubWorkerUrl.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as RpcParent from '../RpcParent/RpcParent.ts'
import * as RpcParentType from '../RpcParentType/RpcParentType.ts'
import * as RpcState from '../RpcState/RpcState.ts'

export const createRpcWithId = async (id: string) => {
  const fn = RpcState.acquire(id)
  const info = ExtensionHostRpcState.get(id)
  if (!info) {
    throw new Error(`rpc with id ${id} not found`)
  }
  const ipc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: ExtensionHostSubWorkerUrl.extensionHostSubWorkerUrl,
    name: info.name,
  })
  const newRpc = await RpcParent.create({
    ipc,
    method: RpcParentType.JsonRpc,
    execute: fn,
  })
  await newRpc.invoke('LoadFile.loadFile', info.url)
  RpcState.set(id, newRpc)
  return newRpc
}
