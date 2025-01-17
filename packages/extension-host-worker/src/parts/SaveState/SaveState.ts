import * as ExtensionHostWebViewState from '../ExtensionHostWebViewState/ExtensionHostWebViewState.ts'
import * as IframeWorker from '../IframeWorker/IframeWorker.ts'

/**
 * @deprecated
 */
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

/**
 * @deprecated
 */
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

const getAdditional = async (): Promise<readonly any[]> => {
  if (!IframeWorker.isActive()) {
    return []
  }
  try {
    return await IframeWorker.invoke('WebView.saveState')
  } catch {
    return []
  }
}

export const saveState = async () => {
  const webViews = ExtensionHostWebViewState.getWebViews()
  const serialized = await serializeWebViews(webViews)
  const additional = await getAdditional()
  const all = [...serialized, ...additional]
  return all
}
