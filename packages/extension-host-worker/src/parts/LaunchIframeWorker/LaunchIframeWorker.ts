import * as GetConfiguredIframeWorkerUrl from '../GetConfiguredIframeWorkerUrl/GetConfiguredIframeWorkerUrl.ts'
import * as Id from '../Id/Id.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as IpcParentType from '../IpcParentType/IpcParentType.ts'
import * as Rpc from '../Rpc/Rpc.ts'

const commandMap = {
  'WebView.compatExtensionHostWorkerInvoke': (...args) => Rpc.invoke('WebView.compatExtensionHostWorkerInvoke', ...args),
  'WebView.compatExtensionHostWorkerInvokeAndTransfer': (...args) =>
    Rpc.invokeAndTransfer('WebView.compatExtensionHostWorkerInvokeAndTransfer', ...args),
  'WebView.compatRendererProcessInvoke': (...args) => Rpc.invoke('WebView.compatRendererProcessInvoke', ...args),
  'WebView.compatRendererProcessInvokeAndTransfer': (...args) => Rpc.invokeAndTransfer('WebView.compatRendererProcessInvokeAndTransfer', ...args),
  'WebView.compatSharedProcessInvoke': (...args) => Rpc.invoke('WebView.compatSharedProcessInvoke', ...args),
  'WebView.getSavedState': (...args) => Rpc.invoke('WebView.WebView', ...args),
  'WebView.getWebViewInfo': (...args) => Rpc.invoke('WebView.getWebViewInfo', ...args),
  'WebView.getWebViews': (...args) => Rpc.invoke('WebView.getWebViews', ...args),
  'WebView.setPort': (...args) => Rpc.invoke('WebView.setPort', ...args),
}

export const launchIframeWorker = async () => {
  const configuredWorkerUrl = await GetConfiguredIframeWorkerUrl.getConfiguredIframeWorkerUrl()
  const name = 'Iframe Worker'
  const id = Id.create()
  const rpc = await IpcParent.create({
    method: IpcParentType.ModuleWorkerAndWorkaroundForChromeDevtoolsBug,
    name,
    url: configuredWorkerUrl,
    id,
    commandMap,
  })
  return rpc
}
