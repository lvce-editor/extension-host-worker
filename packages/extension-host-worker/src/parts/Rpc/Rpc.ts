import * as RpcId from '../RpcId/RpcId.ts'
import * as RpcRegistry from '../RpcRegistry/RpcRegistry.ts'

export const invoke = (method: string, ...params: any[]): Promise<any> => {
  const rpc = RpcRegistry.get(RpcId.RendererWorker)
  return rpc.invoke(method, ...params)
}

export const send = (method: string, ...params: any[]): void => {
  const rpc = RpcRegistry.get(RpcId.RendererWorker)
  return rpc.send(method, ...params)
}

export const invokeAndTransfer = (method: string, ...params: any[]): Promise<any> => {
  const rpc = RpcRegistry.get(RpcId.RendererWorker)
  return rpc.invokeAndTransfer(method, ...params)
}
