import * as IframeWorker from '../IframeWorker/IframeWorker.ts'

export const createWebView3 = async ({
  id,
  uri,
  isGitpod,
  platform,
  assetDir,
  webViewScheme,
  useNewWebViewHandler,
}: {
  id: number
  uri: string
  isGitpod: boolean
  platform: number
  assetDir: string
  webViewScheme: string
  useNewWebViewHandler: boolean
}): Promise<void> => {
  await IframeWorker.invoke('WebView.create3', {
    id,
    uri,
    isGitpod,
    platform,
    assetDir,
    webViewScheme,
    useNewWebViewHandler,
  })
}
