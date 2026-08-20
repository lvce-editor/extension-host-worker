import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { createElectronWebContentsView } from '../../../src/parts/ElectronWebContentsView/ElectronWebContentsView.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

interface EmbedsMockOptions {
  readonly failCreate?: boolean
  readonly failLoad?: boolean
  readonly invocations: unknown[][]
}

const registerEmbedsMock = ({ failCreate = false, failLoad = false, invocations }: EmbedsMockOptions): void => {
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.sendMessagePortToElectron'(port: MessagePort, initialCommand: string): Promise<void> {
      invocations.push(['transfer', initialCommand])
      await PlainMessagePortRpc.create({
        commandMap: {
          'ElectronWebContentsView.click'(id: number, selector: string): boolean {
            invocations.push(['click', id, selector])
            return true
          },
          'ElectronWebContentsView.createWebContentsView'(restoreId: number, keyBindings: readonly string[]): number {
            invocations.push(['create', restoreId, keyBindings])
            if (failCreate) {
              throw new Error('create failed')
            }
            return 42
          },
          'ElectronWebContentsView.disposeWebContentsView'(id: number): void {
            invocations.push(['dispose', id])
          },
          'ElectronWebContentsView.getStats'(id: number): unknown {
            invocations.push(['getStats', id])
            return { canGoBack: false, canGoForward: true, title: 'Example', url: 'https://example.com/' }
          },
          'ElectronWebContentsView.hide'(id: number): void {
            invocations.push(['hide', id])
          },
          'ElectronWebContentsView.insertJavaScript'(id: number, code: string, userGesture: boolean): unknown {
            invocations.push(['executeJavaScript', id, code, userGesture])
            return 'Example'
          },
          'ElectronWebContentsView.reload'(id: number): void {
            invocations.push(['reload', id])
          },
          'ElectronWebContentsView.setIframeSrc'(id: number, url: string): void {
            invocations.push(['loadUrl', id, url])
            if (failLoad) {
              throw new Error('load failed')
            }
          },
        },
        messagePort: port,
      })
    },
  })
}

test('creates a hidden web contents view and forwards operations', async () => {
  const invocations: unknown[][] = []
  registerEmbedsMock({ invocations })

  const view = await createElectronWebContentsView({
    url: 'https://example.com',
  })

  strictEqual(await view.click('.playButton'), true)
  strictEqual(await view.executeJavaScript<string>('document.title'), 'Example')
  strictEqual(await view.executeJavaScript<string>('play()', true), 'Example')
  deepStrictEqual(await view.getStats(), {
    canGoBack: false,
    canGoForward: true,
    title: 'Example',
    url: 'https://example.com/',
  })
  await view.hide()
  await view.reload()
  await view.loadUrl('https://example.com/next')
  await view.dispose()
  await view.dispose()

  deepStrictEqual(invocations, [
    ['transfer', 'HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess'],
    ['create', 0, []],
    ['loadUrl', 42, 'https://example.com'],
    ['click', 42, '.playButton'],
    ['executeJavaScript', 42, 'document.title', false],
    ['executeJavaScript', 42, 'play()', true],
    ['getStats', 42],
    ['hide', 42],
    ['reload', 42],
    ['loadUrl', 42, 'https://example.com/next'],
    ['dispose', 42],
  ])
})

test('disposes the view and rpc when initial navigation fails', async () => {
  const invocations: unknown[][] = []
  registerEmbedsMock({ failLoad: true, invocations })

  await rejects(createElectronWebContentsView({ url: 'https://example.com' }), /load failed/)
  deepStrictEqual(invocations, [
    ['transfer', 'HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess'],
    ['create', 0, []],
    ['loadUrl', 42, 'https://example.com'],
    ['dispose', 42],
  ])
})

test('disposes the rpc when view creation fails', async () => {
  const invocations: unknown[][] = []
  registerEmbedsMock({ failCreate: true, invocations })

  await rejects(createElectronWebContentsView(), /create failed/)
  deepStrictEqual(invocations, [
    ['transfer', 'HandleMessagePortForEmbedsProcess.handleMessagePortForEmbedsProcess'],
    ['create', 0, []],
  ])
})
