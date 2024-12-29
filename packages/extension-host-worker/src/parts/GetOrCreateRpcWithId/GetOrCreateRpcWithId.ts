import * as Assert from '../Assert/Assert.ts'
import * as CreateRpcWithId from '../CreateRpcWithId/CreateRpcWithId.ts'
import * as RpcState from '../RpcState/RpcState.ts'

const getOrCreateRpc = async (id: string, commandMap: any) => {
  const rpc = RpcState.get(id)
  if (!rpc) {
    RpcState.set(id, CreateRpcWithId.createRpcWithId(id, commandMap))
  }
  return RpcState.get(id)
}

export const createRpcWithId = ({ id, commandMap }: { id: string; commandMap: any }) => {
  Assert.string(id)
  RpcState.register(id, commandMap)
  const lazyRpc = {
    async invoke(method, ...params) {
      const rpc = await getOrCreateRpc(id, commandMap)
      return rpc.invoke(method, ...params)
    },
  }
  return lazyRpc
}
