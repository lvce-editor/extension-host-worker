import * as Rpc from '../Rpc/Rpc.ts'

export const notifyStatusBarChange = async (id: string): Promise<void> => {
  await Rpc.invoke('StatusBar.handleChange', id)
}
