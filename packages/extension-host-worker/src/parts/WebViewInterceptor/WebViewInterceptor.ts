import * as IframeWorker from '../IframeWorker/IframeWorker.ts'

export const registerInterceptor = async (id: number, port: MessagePort): Promise<void> => {
  await IframeWorker.invoke('WebView.registerInterceptor', id, port)
}

export const unregisterInterceptor = async (id: number): Promise<void> => {
  await IframeWorker.invoke('WebView.unregisterInterceptor', id)
}
