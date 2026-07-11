import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { createNodeRpc, createRpc } from '../../../src/parts/Rpc/Rpc.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockRpc: MockRpcDisposable | undefined

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
})

test('createNodeRpc proxies calls through the renderer worker', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeCommand'(id: string, ...params: readonly unknown[]): Promise<unknown> {
      invocations.push([id, ...params])
      if (id === 'ExtensionNodeRpc.create') {
        return 42
      }
      if (id === 'ExtensionNodeRpc.invoke') {
        return 'ok'
      }
      return undefined
    },
  })

  const rpc = await createNodeRpc({
    name: 'Git',
    path: '/extensions/git/node/gitClient.js',
  })

  strictEqual(await rpc.invoke('Git.status'), 'ok')
  await rpc.dispose()
  deepStrictEqual(invocations, [
    ['ExtensionNodeRpc.create', 'Git', '/extensions/git/node/gitClient.js'],
    ['ExtensionNodeRpc.invoke', 42, 'Git.status'],
    ['ExtensionNodeRpc.dispose', 42],
  ])
})

test('createRpc transfers a port and worker options', async () => {
  const invocations: unknown[] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.createWebViewWorkerRpc2'(rpcInfo: unknown, port: MessagePort): Promise<void> {
      invocations.push(rpcInfo)
      await PlainMessagePortRpc.create({
        commandMap: {
          'Git.status'(): string {
            return 'ok'
          },
        },
        messagePort: port,
      })
    },
  })

  const rpc = await createRpc({
    commandMap: {},
    name: 'Git Worker',
    url: '/extensions/git/gitWorkerMain.js',
  })

  strictEqual(await rpc.invoke('Git.status'), 'ok')
  deepStrictEqual(invocations, [{ name: 'Git Worker', url: '/extensions/git/gitWorkerMain.js' }])
  await rpc.dispose()
})
