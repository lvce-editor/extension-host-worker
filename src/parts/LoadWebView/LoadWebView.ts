import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'

export const loadWebView = async (providerId, savedState) => {
  const rpc = ExtensionHostWebViewState.getWebView(providerId)
  await rpc.provider.create(rpc, rpc.uri, savedState)
}
