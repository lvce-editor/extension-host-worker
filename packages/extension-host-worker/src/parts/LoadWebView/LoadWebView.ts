import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'

export const loadWebView = async (providerId, savedState) => {
  const rpc = ExtensionHostWebViewState.getWebView(providerId)

  if (rpc && rpc.webView && rpc.webView.rpc && typeof rpc.webView.rpc === 'string') {
    // TODO
  }
  await rpc.provider.create(rpc, rpc.uri, savedState)
}
