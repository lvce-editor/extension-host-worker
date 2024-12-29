import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'
import * as GetPortTuple from '../GetPortTuple/GetPortTuple.ts'
import * as GetOrCreateRpcWithId from '../GetOrCreateRpcWithId/GetOrCreateRpcWithId.ts'
import { getRemoteUrlForWebView } from '../GetRemoteUrlForWebView/GetRemoteUrlForWebView.ts'

const id = 1

export const loadWebView = async (providerId, savedState) => {
  const rpc = ExtensionHostWebViewState.getWebView(providerId)

  if (rpc && rpc.webView && rpc.webView.rpc && typeof rpc.webView.rpc === 'string') {
    const execute = (method, ...params) => {
      switch (method) {
        case 'WebView.getRemoteUrl':
          return getRemoteUrlForWebView(params[0].uri, {
            webViewId: params[0].webViewId,
          })
        default:
          throw new Error('not implemented')
      }
    }

    // TODO maybe make connection directly from iframeworker to webview worker and webview
    // TODO already got port tuple from webview

    const { port1, port2 } = GetPortTuple.getPortTuple()
    // TODO don't need to create lazy rpc at this point
    const workerRpc = await GetOrCreateRpcWithId.createRpcWithId({
      id: rpc.webView.rpc,
      execute,
    })
    console.log({ rpc })
    // TODO
    // await workerRpc.invoke('WebView.setPort', )
    await workerRpc.invokeAndTransfer('WebView.handlePort', id, port1)

    await workerRpc.invoke('WebView.create', {
      webViewId: rpc.webView.id,
      uri: rpc.uri,
      id,
      savedState: {},
    })

    console.log({ workerRpc })
  }
  await rpc.provider.create(rpc, rpc.uri, savedState)
}
