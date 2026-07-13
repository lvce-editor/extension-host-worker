import { LazyTransferMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'

export interface CreateElectronWebContentsViewOptions {
  readonly url?: string
}

export interface ElectronWebContentsViewStats {
  readonly canGoBack: boolean
  readonly canGoForward: boolean
  readonly title: string
  readonly url: string
}

export interface ElectronWebContentsView {
  readonly dispose: () => Promise<void>
  readonly executeJavaScript: <T = unknown>(code: string) => Promise<T>
  readonly getStats: () => Promise<ElectronWebContentsViewStats>
  readonly loadUrl: (url: string) => Promise<void>
  readonly reload: () => Promise<void>
}

const sendMessagePortToEmbedsProcess = async (port: MessagePort): Promise<void> => {
  await ExtensionManagementWorker.invokeAndTransfer(
    'Extensions.sendMessagePortToElectron',
    port,
    'HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess',
  )
}

const disposeAfterCreateError = async (rpc: Rpc, id: number): Promise<void> => {
  try {
    await rpc.invoke('ElectronWebContentsView.disposeWebContentsView', id)
  } finally {
    await rpc.dispose()
  }
}

export const createElectronWebContentsView = async ({ url }: CreateElectronWebContentsViewOptions = {}): Promise<ElectronWebContentsView> => {
  const rpc = await LazyTransferMessagePortRpcParent.create({
    commandMap: {},
    send: sendMessagePortToEmbedsProcess,
  })
  let id: number
  try {
    id = (await rpc.invoke('ElectronWebContentsView.createWebContentsView', 0, [])) as number
  } catch (error) {
    await rpc.dispose()
    throw error
  }
  let disposed = false

  const loadUrl = async (nextUrl: string): Promise<void> => {
    await rpc.invoke('ElectronWebContentsView.setIframeSrc', id, nextUrl)
  }

  try {
    if (url) {
      await loadUrl(url)
    }
  } catch (error) {
    await disposeAfterCreateError(rpc, id)
    throw error
  }

  return {
    async dispose(): Promise<void> {
      if (disposed) {
        return
      }
      disposed = true
      await disposeAfterCreateError(rpc, id)
    },
    async executeJavaScript<T = unknown>(code: string): Promise<T> {
      return (await rpc.invoke('ElectronWebContentsView.insertJavaScript', id, code)) as T
    },
    async getStats(): Promise<ElectronWebContentsViewStats> {
      return (await rpc.invoke('ElectronWebContentsView.getStats', id)) as ElectronWebContentsViewStats
    },
    loadUrl,
    async reload(): Promise<void> {
      await rpc.invoke('ElectronWebContentsView.reload', id)
    },
  }
}
