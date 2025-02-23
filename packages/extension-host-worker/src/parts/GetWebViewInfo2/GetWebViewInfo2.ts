import * as IframeWorker from '../IframeWorker/IframeWorker.ts'

export const getWebViewInfo2 = (providerId: string): Promise<any> => {
  return IframeWorker.invoke('WebView.getWebViewInfo', providerId)
}
