import * as Assert from '../Assert/Assert.ts'
import * as CreateRpcWithId from '../CreateRpcWithId/CreateRpcWithId.ts'
import * as RpcState from '../RpcState/RpcState.ts'

const getOrCreateRpc = async (id: string) => {
  const rpc = RpcState.get(id)
  if (!rpc) {
    RpcState.set(id, CreateRpcWithId.createRpcWithId(id))
  }
  return RpcState.get(id)
}

export const createRpcWithId = ({ id, execute }: { id: string; execute: any }) => {
  Assert.string(id)
  RpcState.register(id, execute)
  const lazyRpc = {
    async invoke(method, ...params) {
      const rpc = await getOrCreateRpc(id)
      await rpc.invoke(method, ...params)
    },
  }
  return lazyRpc
}
