import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker, FileSystemWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { initializeFileSystemWorker, resetFileSystemWorker } from '../../../src/parts/FileSystemWorker/FileSystemWorker.ts'

interface MockRpcDisposable {
  [Symbol.dispose](): void
}

let mockExtensionManagementRpc: MockRpcDisposable | undefined

afterEach(async () => {
  mockExtensionManagementRpc?.[Symbol.dispose]()
  mockExtensionManagementRpc = undefined
  resetFileSystemWorker()
  await FileSystemWorker.dispose().catch(() => {})
})

test('initializeFileSystemWorker lazily transfers a message port on first file system use', async () => {
  const invocations: string[] = []
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.sendMessagePortToFileSystemWorker'(port: MessagePort): Promise<void> {
      invocations.push('Extensions.sendMessagePortToFileSystemWorker')
      await PlainMessagePortRpc.create({
        commandMap: {
          async 'FileSystem.readFile'(): Promise<string> {
            return 'sample content'
          },
        },
        messagePort: port,
      })
    },
  })

  await initializeFileSystemWorker()

  deepStrictEqual(invocations, [])

  const text = await FileSystemWorker.readFile('/tmp/sample.txt')

  strictEqual(text, 'sample content')
  deepStrictEqual(invocations, ['Extensions.sendMessagePortToFileSystemWorker'])
})

test('initializeFileSystemWorker reuses the same lazy rpc', async () => {
  let transferCount = 0
  mockExtensionManagementRpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.sendMessagePortToFileSystemWorker'(port: MessagePort): Promise<void> {
      transferCount++
      await PlainMessagePortRpc.create({
        commandMap: {
          async 'FileSystem.exists'(): Promise<boolean> {
            return true
          },
        },
        messagePort: port,
      })
    },
  })

  await initializeFileSystemWorker()
  await initializeFileSystemWorker()
  const exists = await FileSystemWorker.exists('/tmp/sample.txt')

  strictEqual(exists, true)
  strictEqual(transferCount, 1)
})
