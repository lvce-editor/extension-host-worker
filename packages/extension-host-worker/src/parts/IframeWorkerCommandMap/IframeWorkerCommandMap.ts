import * as GetRemoteUrlForWebView from '../GetRemoteUrlForWebView/GetRemoteUrlForWebView.ts'
import * as Rpc from '../Rpc/Rpc.ts'

export const iframeWorkerCommandMap = {
  'WebView.compatExtensionHostWorkerInvoke': (...args) => Rpc.invoke('WebView.compatExtensionHostWorkerInvoke', ...args),
  'WebView.compatExtensionHostWorkerInvokeAndTransfer': (...args) =>
    Rpc.invokeAndTransfer('WebView.compatExtensionHostWorkerInvokeAndTransfer', ...args),
  'WebView.compatRendererProcessInvoke': (...args) => Rpc.invoke('WebView.compatRendererProcessInvoke', ...args),
  'WebView.compatRendererProcessInvokeAndTransfer': (...args) => Rpc.invokeAndTransfer('WebView.compatRendererProcessInvokeAndTransfer', ...args),
  // @ts-ignore
  'WebView.compatRendererWorkerInvokeAndTransfer': (...args: any[]) => Rpc.invokeAndTransfer(...args),
  // @ts-ignore
  'WebView.compatRendererWorkerInvoke': (...args: any[]) => Rpc.invoke(...args),
  'WebView.compatSharedProcessInvoke': (...args) => Rpc.invoke('WebView.compatSharedProcessInvoke', ...args),
  'WebView.getSavedState': (...args) => Rpc.invoke('WebView.getSavedState', ...args),
  'WebView.getWebViewInfo': (...args) => Rpc.invoke('WebView.getWebViewInfo', ...args),
  'WebView.getWebViews': (...args) => Rpc.invoke('WebView.getWebViews', ...args),
  'WebView.setPort': (...args) => Rpc.invoke('WebView.setPort', ...args),
  'ExtensionHostManagement.activateByEvent': (...args) => Rpc.invoke('ExtensionHostManagement.activateByEvent', ...args),
  'WebView.getRemoteUrl': (options) => GetRemoteUrlForWebView.getRemoteUrlForWebView(options.uri, options),
}
