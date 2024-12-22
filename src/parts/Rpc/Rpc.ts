import type { Rpc } from '@lvce-editor/rpc'

interface State {
  rpc: any
}

const state: State = {
  rpc: undefined,
}

export const invoke = (method: string, ...params: any[]): Promise<any> => {
  const rpc = state.rpc
  return rpc.invoke(method, ...params)
}

export const invokeAndTransfer = (method: string, ...params: any[]): Promise<any> => {
  const rpc = state.rpc
  return rpc.invokeAndTransfer(method, ...params)
}

export const setRpc = (rpc: Rpc): void => {
  state.rpc = rpc
}
