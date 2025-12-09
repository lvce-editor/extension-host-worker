import { MessagePortRpcParent } from '@lvce-editor/rpc'
import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'

// TODO pass uuid to allow having multiple webviews open at the same time

/**
 * @deprecated use iframe worker instead of creating and querying webviews
 */
export const createWebView = async (providerId: string, port: MessagePort, uri: string, uid: number, origin: string, webView: any): Promise<void> => {
  const provider = ExtensionHostWebViewState.getProvider(providerId)
  if (!provider) {
    throw new Error(`webview provider ${providerId} not found`)
  }

  // TODO cancel promise when webview is disposed before sending message
  // TODO handle case when webview doesn't send ready message

  const rpc = await MessagePortRpcParent.create({
    commandMap: provider.commands || {},
    isMessagePortOpen: false,
    messagePort: port,
  })

  const outer = {
    async invoke(method, ...params) {
      return rpc.invoke(method, ...params)
    },
    origin,
    provider,
    uid,
    uri,
    webView,
  }
  // TODO allow creating multiple webviews per provider
  ExtensionHostWebViewState.setWebView(providerId, outer)
}

export const disposeWebView = (id) => {
  // TODO race condition
  // const webView=webViews[id]
}

/**
 * @deprecated use iframe worker instead of creating and querying webviews
 */
export const registerWebViewProvider = (provider) => {
  ExtensionHostWebViewState.setProvider(provider.id, provider)
}

/**
 * @deprecated use iframe worker instead of creating and querying webviews
 */
export const getWebViewInfo = (providerId: string) => {
  const webView = ExtensionHostWebViewState.getWebView(providerId)
  if (!webView) {
    throw new Error(`Webview not found: ${providerId}`)
  }
  return {
    origin: webView.origin,
    uid: webView.uid,
    uri: webView.uri,
  }
}
