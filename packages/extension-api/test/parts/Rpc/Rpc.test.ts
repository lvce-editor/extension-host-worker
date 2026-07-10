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

test('createNodeRpc transfers a port and loads the requested file', async () => {
  const invocations: string[] = []
  let loadedPath = ''
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.sendMessagePortToElectron'(port: MessagePort, initialCommand: string): Promise<void> {
      invocations.push(initialCommand)
      await PlainMessagePortRpc.create({
        commandMap: {
          'LoadFile.loadFile'(path: string): void {
            loadedPath = path
          },
        },
        messagePort: port,
      })
    },
  })

  const rpc = await createNodeRpc({
    name: 'Git',
    path: '/extensions/git/node/gitClient.js',
  })

  strictEqual(loadedPath, '/extensions/git/node/gitClient.js')
  deepStrictEqual(invocations, ['HandleMessagePortForExtensionHostHelperProcess.handleMessagePortForExtensionHostHelperProcess'])
  await rpc.dispose()
})

test('createRpc transfers a port and loads the requested file', async () => {
  const invocations: unknown[] = []
  let loadedUrl = ''
  mockRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.createWebViewWorkerRpc'(rpcInfo: unknown, port: MessagePort): Promise<void> {
      invocations.push(rpcInfo)
      await PlainMessagePortRpc.create({
        commandMap: {
          'LoadFile.loadFile'(url: string): void {
            loadedUrl = url
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

  strictEqual(loadedUrl, '/extensions/git/gitWorkerMain.js')
  deepStrictEqual(invocations, [{ name: 'Git Worker' }])
  await rpc.dispose()
})
