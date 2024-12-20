import * as Callback from '../Callback/Callback.ts'
import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'
import * as WaitForFirstMessage from '../WaitForFirstMessage/WaitForFirstMessage.ts'

// TODO pass uuid to allow having multiple webviews open at the same time
export const createWebView = async (providerId: string, port: MessagePort, uri: string, uid: number, origin: string) => {
  const provider = ExtensionHostWebViewState.getProvider(providerId)
  if (!provider) {
    throw new Error(`webview provider ${providerId} not found`)
  }

  // TODO cancel promise when webview is disposed before sending message
  // TODO handle case when webview doesn't send ready message
  // TODO handle error
  const firstMessage = await WaitForFirstMessage.waitForFirstMessage(port)
  // @ts-ignore
  if (firstMessage.data !== 'ready') {
    // TODO handle error
  }

  // TODO use ipc module
  const handlePortMessage = async (event) => {
    const { data, target } = event
    const { method, params, id } = data
    if (provider && provider.commands && provider.commands[method]) {
      const fn = provider.commands[method]
      const result = await fn(...params)
      if (id && method) {
        target.postMessage({
          jsonrpc: '2.0',
          id,
          result,
        })
      } else if (id) {
        Callback.resolve(id, data)
      }
    }
  }

  port.onmessage = handlePortMessage
  const rpc = {
    uri,
    provider,
    uid,
    origin,
    async invoke(method, ...params) {
      // TODO return promise with result
      const { id, promise } = Callback.registerPromise()
      port.postMessage({
        jsonrpc: '2.0',
        id,
        method,
        params,
      })
      const result = await promise
      console.log({ result })
    },
  }
  // TODO allow creating multiple webviews per provider
  ExtensionHostWebViewState.setWebView(providerId, rpc)
}

export const load = async (providerId, savedState) => {
  const rpc = ExtensionHostWebViewState.getWebView(providerId)
  await rpc.provider.create(rpc, rpc.uri, savedState)
}

export const disposeWebView = (id) => {
  // TODO race condition
  // const webView=webViews[id]
}

export const registerWebViewProvider = (provider) => {
  ExtensionHostWebViewState.setProvider(provider.id, provider)
}
