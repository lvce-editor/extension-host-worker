import type { Rpc } from '@lvce-editor/rpc'

let rpc: Rpc | undefined

export const set = (value: Rpc): void => {
  rpc = value
}

export const isActive = (): boolean => {
  return Boolean(rpc)
}

export const invoke = async (method: string, ...params: readonly any[]): Promise<any> => {
  if (!rpc) {
    return undefined
  }
  return rpc.invoke(method, ...params)
}
