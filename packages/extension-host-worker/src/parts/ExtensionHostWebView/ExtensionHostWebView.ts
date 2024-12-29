import { MessagePortRpcParent } from '@lvce-editor/rpc'
import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'

// TODO pass uuid to allow having multiple webviews open at the same time
export const createWebView = async (providerId: string, port: MessagePort, uri: string, uid: number, origin: string, webView: any): Promise<void> => {
  const provider = ExtensionHostWebViewState.getProvider(providerId)
  if (!provider) {
    throw new Error(`webview provider ${providerId} not found`)
  }

  // TODO cancel promise when webview is disposed before sending message
  // TODO handle case when webview doesn't send ready message

  const rpc = await MessagePortRpcParent.create({
    messagePort: port,
    isMessagePortOpen: false,
    commandMap: provider.commands || {},
  })

  const outer = {
    uri,
    provider,
    uid,
    origin,
    webView,
    async invoke(method, ...params) {
      return rpc.invoke(method, ...params)
    },
  }
  // TODO allow creating multiple webviews per provider
  ExtensionHostWebViewState.setWebView(providerId, outer)
}

export const disposeWebView = (id) => {
  // TODO race condition
  // const webView=webViews[id]
}

export const registerWebViewProvider = (provider) => {
  ExtensionHostWebViewState.setProvider(provider.id, provider)
}

export const getWebViewInfo = (providerId: string) => {
  const webView = ExtensionHostWebViewState.getWebView(providerId)
  if (!webView) {
    throw new Error(`Webview not found: ${providerId}`)
  }
  return {
    uid: webView.uid,
    origin: webView.origin,
    uri: webView.uri,
  }
}
