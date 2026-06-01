import * as Rpc from '../Rpc/Rpc.ts'

export const executeCommand = async (id: string, ...args: readonly unknown[]): Promise<unknown> => {
  return Rpc.invoke('Commands.executeCommand', id, ...args)
}
