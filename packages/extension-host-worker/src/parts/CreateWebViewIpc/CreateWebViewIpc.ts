import { IpcParentWithMessagePort } from '@lvce-editor/ipc'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const createWebViewIpc = async (webView: any): Promise<any> => {
  const { uid, origin } = webView
  const { port1, port2 } = GetPortTuple.getPortTuple()
  const readyPromse = IpcParentWithMessagePort.create({
    messagePort: port2,
    isMessagePortOpen: false,
  })
  const portType = 'test'
  await Rpc.invokeAndTransfer('WebView.setPort', uid, port1, origin, portType)
  await readyPromse
  const ipc = IpcParentWithMessagePort.wrap(port2)
  // TODO maybe don't send a message port only to get object url?
  // TODO dispose ipc to avoid memory leak
  HandleIpc.handleIpc(ipc)
  return ipc
}
