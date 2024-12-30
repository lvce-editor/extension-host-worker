import * as RendererWorkerIpcParentType from '../RendererWorkerIpcParentType/RendererWorkerIpcParentType.ts'
import * as ParentRpc from '../Rpc/Rpc.ts'

export const createWebViewWorkerRpc = async (rpcInfo: any, port: MessagePort): Promise<void> => {
  // TODO this function is called from the iframe worker to create a direct
  // connection between a webview/iframe and it's webworker. For this to work
  // the iframe worker creates a messagechannel and sends one messageport to the webview
  // and the other messageport to the webworker. This enables direct communication via
  // the two message ports
  await ParentRpc.invokeAndTransfer('IpcParent.create', {
    method: RendererWorkerIpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    url: rpcInfo.url,
    name: rpcInfo.name,
    raw: true,
    port,
  })
}