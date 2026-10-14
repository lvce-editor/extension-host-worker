import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { deepStrictEqual, rejects, strictEqual } from 'node:assert/strict'
import { test } from 'node:test'
import { createFileSystemWatcher, handleFileWatcherEvent } from '../../../src/parts/FileSystemWatcher/FileSystemWatcher.ts'

test('watcher delivers setup events before resolving readiness and stops events after disposal', async () => {
  const received: unknown[] = []
  const { promise, resolve } = Promise.withResolvers<void>()
  let id = 0
  let disposed = 0
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.createFileSystemWatcher'(clientId: number): Promise<void> {
      id = clientId
      await handleFileWatcherEvent(id, { eventName: 'change', uri: 'file:///workspace/index.ts' })
      await promise
    },
    'Extensions.disposeFileSystemWatcher'(): void {
      disposed++
    },
  })
  const creating = createFileSystemWatcher({ roots: ['file:///workspace'] }, (event) => {
    received.push(event)
  })
  strictEqual(received.length, 1)
  resolve()
  const watcher = await creating
  await handleFileWatcherEvent(id, { error: { message: 'watch limit reached', name: 'Error' }, eventName: 'error', uri: '' })
  strictEqual(received.length, 2)
  await watcher.dispose()
  await watcher.dispose()
  await handleFileWatcherEvent(id, { eventName: 'change', uri: 'file:///workspace/stale.ts' })
  strictEqual(received.length, 2)
  strictEqual(disposed, 1)
})

test('failed setup drops its callback and preserves the failure', async () => {
  let id = 0
  const events: unknown[] = []
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.createFileSystemWatcher'(clientId: number): never {
      id = clientId
      throw new Error('ENOSPC')
    },
    'Extensions.disposeFileSystemWatcher'(): never {
      throw new Error('older host')
    },
  })
  await rejects(
    createFileSystemWatcher({ roots: ['file:///workspace'] }, (event) => {
      events.push(event)
    }),
    /ENOSPC/,
  )
  await handleFileWatcherEvent(id, { eventName: 'change', uri: 'file:///workspace/stale.ts' })
  deepStrictEqual(events, [])
})

test('disposal failures can be retried while callback delivery remains stopped', async () => {
  let attempts = 0
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.createFileSystemWatcher'(): void {},
    'Extensions.disposeFileSystemWatcher'(): void {
      if (++attempts === 1) throw new Error('transport')
    },
  })
  const watcher = await createFileSystemWatcher({ roots: ['file:///workspace'] }, () => {})
  await rejects(watcher.dispose(), /transport/)
  await watcher.dispose()
  strictEqual(attempts, 2)
})

test('invalid handlers do not start a backend watch', async () => {
  // @ts-expect-error invalid handler
  await rejects(createFileSystemWatcher({ roots: ['file:///workspace'] }, undefined), /handler must be a function/)
})

test('shallow watcher options reach the backend unchanged', async () => {
  const options = { recursive: false, roots: ['file:///workspace'] }
  let observed: unknown
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.createFileSystemWatcher'(_id: number, value: unknown): void {
      observed = value
    },
    'Extensions.disposeFileSystemWatcher'(): void {},
  })
  const watcher = await createFileSystemWatcher(options, () => {})
  deepStrictEqual(observed, options)
  await watcher.dispose()
})
