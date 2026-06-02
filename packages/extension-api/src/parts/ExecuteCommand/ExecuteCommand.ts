import * as Rpc from '../Rpc/Rpc.ts'

export const executeCommand = async (id: string, ...args: readonly unknown[]): Promise<unknown> => {
  return Rpc.invoke('Extensions.executeCommand', id, ...args)
}
