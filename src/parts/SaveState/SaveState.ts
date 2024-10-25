import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'

const serializeWebView = async (webView) => {
  if (webView && webView.provider && webView.provider.saveState) {
    const saved = await webView.provider.saveState()
    return {
      uri: webView.uri,
      state: saved,
    }
  }
  return undefined
}

const serializeWebViews = async (webViews) => {
  const serialized: any[] = []
  for (const [key, value] of Object.entries(webViews)) {
    const serializedValue = await serializeWebView(value)
    if (serializedValue) {
      serialized.push({
        key,
        value: serializedValue,
      })
    }
  }
  return serialized
}

export const saveState = async () => {
  const webViews = ExtensionHostWebViewState.getWebViews()
  const serialized = await serializeWebViews(webViews)
  return serialized
}
