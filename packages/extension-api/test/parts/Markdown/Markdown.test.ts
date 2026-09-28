import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { VirtualDomElements, text, type VirtualDomNode } from '@lvce-editor/virtual-dom-worker'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { markdownToVirtualDom } from '../../../src/parts/Markdown/Markdown.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('markdownToVirtualDom uses host commands to render markdown and convert html', async () => {
  const invocations: unknown[][] = []
  const markdownVirtualDom: readonly VirtualDomNode[] = [{ childCount: 1, type: VirtualDomElements.H3 }, text('Details')]
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...args])
      if (id === 'Markdown.renderMarkdown') {
        strictEqual(args[0], '### Details')
        return '<h3>Details</h3>'
      }
      if (id === 'Markdown.getVirtualDom') {
        strictEqual(args[0], '<h3>Details</h3>')
        return markdownVirtualDom
      }
      throw new Error(`Unexpected command ${id}`)
    },
  })

  const result = await markdownToVirtualDom('### Details')

  deepStrictEqual(invocations, [
    ['Markdown.renderMarkdown', '### Details'],
    ['Markdown.getVirtualDom', '<h3>Details</h3>'],
  ])
  deepStrictEqual(result, [{ childCount: 1, type: VirtualDomElements.H3 }, text('Details')])
})
