import * as RpcParentType from '../RpcParentType/RpcParentType.ts'
import * as RpcParentWithJsonRpc from '../RpcParentWithJsonRpc/RpcParentWithJsonRpc.ts'

export const getModule = (method) => {
  switch (method) {
    case RpcParentType.JsonRpc:
      return RpcParentWithJsonRpc
    default:
      throw new Error('unexpected rpc type')
  }
}
