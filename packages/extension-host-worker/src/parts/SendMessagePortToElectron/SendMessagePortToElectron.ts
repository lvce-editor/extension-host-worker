import * as Rpc from '../Rpc/Rpc.ts'

export const sendMessagePortToElectron = async (port: MessagePort, initialCommand: string): Promise<void> => {
  await Rpc.invokeAndTransfer('SendMessagePortToElectron.sendMessagePortToElectron', port, initialCommand)
}
