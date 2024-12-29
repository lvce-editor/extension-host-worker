import { MessagePortRpcParent } from '@lvce-editor/rpc'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const createWebViewIpc = async (webView: any): Promise<any> => {
  const { uid, origin } = webView
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const rpcPromise = MessagePortRpcParent.create({
    messagePort: port2,
    isMessagePortOpen: false,
    commandMap: {},
  })
  const portType = 'test'
  await Rpc.invokeAndTransfer('WebView.setPort', uid, port1, origin, portType)
  // TODO maybe don't send a message port only to get object url?
  // TODO dispose rpc to avoid memory leak
  const rpc = await rpcPromise
  return rpc
}
