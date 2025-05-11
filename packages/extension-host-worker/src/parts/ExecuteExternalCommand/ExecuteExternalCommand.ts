import * as Rpc from '../Rpc/Rpc.ts'

export const executeExternalCommand = (method: string, ...params: readonly any[]): Promise<any> => {
  return Rpc.invoke(method, ...params)
}
