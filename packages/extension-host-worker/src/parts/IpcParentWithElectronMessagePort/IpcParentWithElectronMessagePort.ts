import { MessagePortRpcParent } from '@lvce-editor/rpc'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as SendMessagePortToElectron from '../SendMessagePortToElectron/SendMessagePortToElectron.ts'

const getPort = async (type) => {
  const { port1, port2 } = GetPortTuple.getPortTuple()
  await SendMessagePortToElectron.sendMessagePortToElectron(
    port1,
    'HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess',
  )
  return port2
}

export const create = async ({ type }) => {
  const port = await getPort(type)
  const rpc = await MessagePortRpcParent.create({
    messagePort: port,
    isMessagePortOpen: true,
    commandMap: {},
  })
  return rpc
}
