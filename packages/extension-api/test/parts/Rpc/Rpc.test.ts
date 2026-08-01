import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { createNodeRpc, createRpc } from '../../../src/parts/Rpc/Rpc.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

class MockWebSocket extends EventTarget {
  static readonly OPEN = 1
  static readonly instances: MockWebSocket[] = []
  readonly protocols: string[]
  readonly readyState = MockWebSocket.OPEN
  readonly url: string

  constructor(url: string, protocols: string[]) {
    super()
    this.url = url
    this.protocols = protocols
    MockWebSocket.instances.push(this)
    queueMicrotask(() => this.dispatchEvent(new Event('open')))
  }

  close(): void {}
  send(): void {}
}

let mockRpc: MockRpcDisposable | undefined
const originalWebSocket = WebSocket

afterEach(() => {
  mockRpc?.[Symbol.dispose]()
  mockRpc = undefined
  MockWebSocket.instances.length = 0
  globalThis.WebSocket = originalWebSocket
})

test('createNodeRpc opens the authorized websocket directly', async () => {
  globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.createNodeRpcConnection'(id: string): Promise<unknown> {
      invocations.push(['Extensions.createNodeRpcConnection', id])
      return {
        protocols: ['lvce-rpc', 'lvce-capability.token'],
        type: 'websocket',
        url: 'wss://example.com/websocket/capability',
      }
    },
  })

  const rpc = await createNodeRpc({ id: 'git-client' })

  deepStrictEqual(invocations, [['Extensions.createNodeRpcConnection', 'git-client']])
  strictEqual(MockWebSocket.instances[0].url, 'wss://example.com/websocket/capability')
  deepStrictEqual(MockWebSocket.instances[0].protocols, ['lvce-rpc', 'lvce-capability.token'])
  await rpc.dispose()
})

test('createNodeRpc transfers a restricted message port in Electron', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.createNodeRpcConnection'(id: string): Promise<unknown> {
      invocations.push(['Extensions.createNodeRpcConnection', id])
      return { type: 'message-port' }
    },
    async 'Extensions.createNodeRpcMessagePort'(id: string, port: MessagePort): Promise<void> {
      invocations.push(['Extensions.createNodeRpcMessagePort', id])
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

  const rpc = await createNodeRpc({ id: 'git-client' })

  strictEqual(await rpc.invoke('Git.status'), 'ok')
  deepStrictEqual(invocations, [
    ['Extensions.createNodeRpcConnection', 'git-client'],
    ['Extensions.createNodeRpcMessagePort', 'git-client'],
  ])
  await rpc.dispose()
})

test('createNodeRpc requires an id', async () => {
  await rejects(createNodeRpc({ id: '' }), new TypeError('createNodeRpc requires an id'))
})

test('createNodeRpc uses the bound compatibility proxy with an older renderer', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.createLegacyNodeRpc'(id: string): Promise<number> {
      invocations.push(['create', id])
      return 42
    },
    async 'Extensions.createNodeRpcConnection'(): Promise<unknown> {
      return { type: 'legacy-proxy' }
    },
    async 'Extensions.disposeLegacyNodeRpc'(rpcId: number): Promise<void> {
      invocations.push(['dispose', rpcId])
    },
    async 'Extensions.invokeLegacyNodeRpc'(rpcId: number, method: string): Promise<string> {
      invocations.push(['invoke', rpcId, method])
      return 'ok'
    },
  })

  const rpc = await createNodeRpc({ id: 'git-client' })

  strictEqual(await rpc.invoke('Git.status'), 'ok')
  await rpc.dispose()
  deepStrictEqual(invocations, [
    ['create', 'git-client'],
    ['invoke', 42, 'Git.status'],
    ['dispose', 42],
  ])
})

test('createNodeRpc remains compatible with older extension management', async () => {
  const invocations: unknown[][] = []
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.createNodeRpcConnection'(): Promise<never> {
      throw new Error('Command not found Extensions.createNodeRpcConnection')
    },
    async 'Extensions.executeCommand'(command: string, ...args: readonly unknown[]): Promise<unknown> {
      invocations.push([command, ...args])
      if (command === 'ExtensionNodeRpc.create') {
        return 7
      }
      if (command === 'ExtensionNodeRpc.invoke') {
        return 'ok'
      }
      return undefined
    },
    async 'Extensions.getNodeRpcInfo'(id: string): Promise<unknown> {
      invocations.push(['get-info', id])
      return { name: 'Git Client', path: '/extensions/git/client.js' }
    },
  })

  const rpc = await createNodeRpc({ id: 'git-client' })

  strictEqual(await rpc.invoke('Git.status'), 'ok')
  await rpc.dispose()
  deepStrictEqual(invocations, [
    ['get-info', 'git-client'],
    ['ExtensionNodeRpc.create', 'Git Client', '/extensions/git/client.js'],
    ['ExtensionNodeRpc.invoke', 7, 'Git.status'],
    ['ExtensionNodeRpc.dispose', 7],
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
    contentSecurityPolicy: `default-src 'none'; script-src 'self' 'unsafe-eval';`,
    name: 'Git Worker',
    url: '/extensions/git/gitWorkerMain.js',
  })

  strictEqual(await rpc.invoke('Git.status'), 'ok')
  deepStrictEqual(invocations, [
    {
      contentSecurityPolicy: `default-src 'none'; script-src 'self' 'unsafe-eval';`,
      name: 'Git Worker',
      url: '/extensions/git/gitWorkerMain.js',
    },
  ])
  await rpc.dispose()
})
