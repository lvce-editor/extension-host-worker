import * as RpcId from '../RpcId/RpcId.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const invoke = (method: string, ...params: any[]): Promise<any> => {
  // TODO
  throw new Error(`not implemented`)
}

export const invokeAndTransfer = (method: string, ...params: any[]): Promise<any> => {
  const rpc = RpcRegistry.get(RpcId.RendererWorker)
  return rpc.invokeAndTransfer(method, ...params)
}
